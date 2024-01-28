import { loadGraphFromJson } from "../utils/graph";
import { Request, Response } from "express";

// Search for the optimal/shortest path between two stations
export const search = async (req: Request, res: Response) => {
	const startStation = req.query.startStation as string;
	const targetStation = req.query.targetStation as string;

	console.log("Start station:", startStation);
	console.log("Target station:", targetStation);

	try {
		const graph = loadGraphFromJson("./src/data/routes.json");

		const startStationId = graph.getNodeIdByName(startStation);
		const targetStationId = graph.getNodeIdByName(targetStation);

		console.log("Start station ID:", startStationId);
		console.log("Target station ID:", targetStationId);

		const result = graph.findShortestPath(startStationId, targetStationId);

        console.log("Path:", result);
	} catch (error) {
		console.error("Error loading graph data:", error);
		res.status(500).send({ error: "Internal server error" });
	}
};
