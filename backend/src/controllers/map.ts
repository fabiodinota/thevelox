import { loadGraphFromJson } from "../utils/graph";
import { Request, Response } from 'express';

export const search = async (req: Request, res: Response) => {
    const startStation = req.query.startStation as string;
    const targetStation = req.query.targetStation as string;

    console.log('Start station:', startStation);
    console.log('Target station:', targetStation);

    try {
        const graph = loadGraphFromJson('./src/data/map_graph_structure.json');
        
        const startStationId = graph.getNodeIdByName(startStation);
        const targetStationId = graph.getNodeIdByName(targetStation);

        console.log('Start station ID:', startStationId);
        console.log('Target station ID:', targetStationId);
    
        const path = graph.findShortestPathBFS(startStationId, targetStationId);
        
        if(path.length > 0) {
            console.log('Shortest path:', path);
            res.send({ path });
        } else {
            console.log('No path found');
            res.send({ error: 'No path found' });
        }
    } catch (error) {
        console.error('Error loading graph data:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}
