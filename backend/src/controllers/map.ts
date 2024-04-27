import { PrismaClient } from "@prisma/client";
import { getStationsWithLevels, loadGraphFromJson } from "../utils/graph";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
	user?: {
		user_id: number;
		iat: string;
		exp: string;
	}; // Adjusted to match the types that jwt.verify can return
}

interface Ticket {
	departureTime: string;
	arrivalTime: string;
	startStation: string;
	endStation: string;
	startLevel: number;
	endLevel: number;
	times: string[];
}

// Search for the optimal/shortest path between two stations
export const search = async (req: CustomRequest, res: Response) => {
	const startStation = req.query.startStation as string;
	const targetStation = req.query.endStation as string;
	const departureDate = req.query.departureDate as string;

	const user_id = req.user?.user_id;

	const user = await prisma.users.findUnique({
		where: {
			user_id,
		},
	});

	console.log("User:", user);

	console.log("Start station:", startStation);
	console.log("Target station:", targetStation);

	try {
		const graph = loadGraphFromJson("./src/data/routes.json");

		const startStationId = graph.getNodeIdByName(startStation);
		const targetStationId = graph.getNodeIdByName(targetStation);

		console.log("Start station ID:", startStationId);
		console.log("Target station ID:", targetStationId);

		const result = graph.findShortestPath(startStationId, targetStationId);

		const trainTimes = generateTrainTimes({
			initialTime: departureDate,
			stations: result.path,
			numberOfTrains: 12,
		});

		const tickets: Ticket[] = [];

		trainTimes.forEach((times, index) => {
			const departureTime = times[0];
			const arrivalTime = times[times.length - 1];
			const ticket = createTicket({
				departureTime,
				arrivalTime,
				startStation,
				endStation: targetStation,
				startLevel: getLevelFromLine(result.lines[0]),
				endLevel: getLevelFromLine(
					result.lines[result.lines.length - 1]
				),
				times,
			});

			tickets.push(ticket);

			console.log("Ticket", index + 1, ":", ticket);
		});

		console.log("Path:", result.path, "Lines:", result.lines);
		res.json({
			startStation: startStation,
			endStation: targetStation,
			path: result.path,
			lines: result.lines,
			trainTimes: trainTimes,
			tickets: tickets,
		});
	} catch (error) {
		console.error("Error loading graph data:", error);
		res.status(500).send({ error: "Internal server error" });
	}
};

export const getDestinations = async (req: Request, res: Response) => {
	const destinations = getStationsWithLevels("./src/data/routes.json");

	res.json({ destinations });
};

interface TrainTimeProps {
	initialTime: string;
	stations: string[];
	numberOfTrains?: number;
}

export const generateTrainTimes = ({
	initialTime,
	stations,
	numberOfTrains = 12,
}: TrainTimeProps) => {
	let times = [];
	console.log("Initial time received:", initialTime);
	let initialDeparture = new Date(initialTime);
	console.log("Converted Date object:", initialDeparture.toISOString());

	for (let trainIndex = 0; trainIndex < numberOfTrains; trainIndex++) {
		let startDelay = Math.floor(Math.random() * 6) + 5; // Delay between 5 to 10 minutes
		let currentTime = new Date(
			initialDeparture.getTime() + startDelay * 60000
		);
		let pathTimes = [];

		for (let station of stations) {
			let travelTime = Math.floor(Math.random() * 2) + 1; // Travel time between 1 to 2 minutes
			currentTime = new Date(currentTime.getTime() + travelTime * 60000);
			pathTimes.push(currentTime.toISOString());
		}

		times.push(pathTimes); // Collect times for one complete path across all stations

		// IMPORTANT: Update the initial departure time for the next train to be after the last station time
		let nextTrainDelay = Math.floor(Math.random() * 11) + 5; // Delay for next train between 5 to 15 minutes
		initialDeparture = new Date(
			currentTime.getTime() + nextTrainDelay * 60000
		);
	}

	return times;
};

const createTicket = ({
	departureTime,
	arrivalTime,
	startStation,
	endStation,
	startLevel,
	endLevel,
	times,
}: Ticket) => {
	const ticket = {
		departureTime,
		arrivalTime,
		startStation,
		endStation,
		startLevel,
		endLevel,
		times,
	};

	return ticket;
};

const getLevelFromLine = (line: string) => {
	return parseInt(line.split("-")[0]);
};
