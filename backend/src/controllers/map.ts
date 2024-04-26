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

// Search for the optimal/shortest path between two stations
export const search = async (req: CustomRequest, res: Response) => {
	const startStation = req.query.startStation as string;
	const targetStation = req.query.endStation as string;
	const departureTime = req.query.departureTime as string;

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

		console.log("Path:", result.path, "Lines:", result.lines);
		res.json({ path: result.path, lines: result.lines });
	} catch (error) {
		console.error("Error loading graph data:", error);
		res.status(500).send({ error: "Internal server error" });
	}
};

export const getDestinations = async (req: Request, res: Response) => {
	const destinations = getStationsWithLevels("./src/data/routes.json");

	res.json({ destinations });
};
