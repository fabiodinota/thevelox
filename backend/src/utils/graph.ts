import fs from "fs";
import path from "path";
import PriorityQueue from "priorityqueuejs";

// Types for Node
interface INode {
	id: string;
	name: string;
}

// Types for Edge
interface IEdge {
	sourceId: string;
	targetId: string;
    lineId: Set<string>;
}

class Node {
	id: string;
    name: string;
    lines: Set<string>; // IDs of lines this station is a part of
    edges: Edge[];

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.lines = new Set();
        this.edges = [];
    }
}

class Edge {
    source: Node;
    target: Node;
    lines: Set<string>;  // Add this line
    weight: number;  // Add this line

    constructor(source: Node, target: Node, lines: string[], weight: number) {
        this.source = source;
        this.target = target;
        this.lines = new Set(lines);
        this.weight = weight;
    }
}

class Graph {
	nodes: Map<string, Node>;
	edges: Edge[];

	constructor() {
		this.nodes = new Map();
		this.edges = [];
	}

    // Add a node to the graph
	addNode(id: string, name: string): Node {
		const node = new Node(id, name);
		this.nodes.set(id, node); // Use ID as key
		return node;
	}

    // Add an edge between two nodes
	addEdge(sourceId: string, targetId: string): void {
		const sourceNode = this.nodes.get(sourceId);
		const targetNode = this.nodes.get(targetId);
        
        const edgeWeight = 1; // All edges have the same weight
        if (sourceNode && targetNode) {
            // Determine the common lines between the source and target nodes
            const commonLines = [...sourceNode.lines].filter(x => targetNode.lines.has(x));
    
            // Add edge from source to target
            let edge = new Edge(sourceNode, targetNode, commonLines, edgeWeight);
            sourceNode.edges.push(edge);
            this.edges.push(edge);
    
            // Add edge from target back to source for undirected graph
            edge = new Edge(targetNode, sourceNode, commonLines, edgeWeight);
            targetNode.edges.push(edge);
            this.edges.push(edge);
        } else {
            throw new Error(`Edge with undefined node: ${sourceId} -> ${targetId}`);
        }
	}

    // Make use of BFS to find the shortest path, no matter how many transfers
	findShortestPath(startId: string, targetId: string): string[] {
		const visited = new Map<string, boolean>();
		const previous = new Map<string, string | null>();
		const queue: Node[] = [];

		// Initialize visited and previous maps
		this.nodes.forEach((node) => {
			visited.set(node.id, false);
			previous.set(node.id, null);
		});

		const startNode = this.nodes.get(startId);
		if (!startNode) {
			console.log(`Start node with ID ${startId} not found.`);
			return [];
		}

		if (startId === targetId) {
			console.log(`Start node and target node are the same.`);
			return [];
		}

		console.log(`Starting BFS from: ${startNode.name}`);

		visited.set(startId, true);
		queue.push(startNode);

		while (queue.length > 0) {
			const currentNode = queue.shift()!;

			if (currentNode.id === targetId) {
				const path = [];
				let current: string | null = targetId;

				console.log(
					`Target node ${
						this.nodes.get(targetId)?.name
					} found. Building path...`
				);

				while (current !== null) {
					path.unshift(this.nodes.get(current)?.name ?? "Unknown");
					current = previous.get(current) ?? null;
				}

				return path;
			}

			currentNode.edges.forEach((edge) => {
				const neighbor = edge.target;
				if (!visited.get(neighbor.id)) {
					visited.set(neighbor.id, true);
					previous.set(neighbor.id, currentNode.id);
					queue.push(neighbor);
				}
			});
		}

		console.log(
			`Target node ${this.nodes.get(targetId)?.name} not reachable from ${
				startNode.name
			}`
		);
		return [];
	}

    // Input node name and return ID
	getNodeIdByName(name: string): string {
		let nodeId: string = "";
		this.nodes.forEach((node) => {
			if (node.name === name) {
				nodeId = node.id;
			}
		});
		return nodeId;
	}

    // Find the optimal path using a modified Dijkstra's algorithm.
    findOptimalPath(startId: string, targetId: string): { path: string[], lines: string[] } {
        const costs = new Map<string, number>();
        const previous = new Map<string, { nodeId: string, lineId: string | null }>();
        const priorityQueue = new PriorityQueue<{ node: Node, lineId: string | null, cost: number }>((a, b) => {
            if (a.cost < b.cost) return -1;
            if (a.cost > b.cost) return 1;
            return 0;
        });
        const lineChangePenalty = 3;

        this.nodes.forEach((node, nodeId) => {
            costs.set(nodeId, 0);
        });
        
        costs.set(startId, 0);
        priorityQueue.enq({ node: this.nodes.get(startId)!, lineId: null, cost: 0 });

        console.log(`Starting Dijkstra's algorithm from: ${this.nodes.get(startId)?.name}`);
        console.log(costs)

        while (!priorityQueue.isEmpty()) {
            console.log("Priority queue:", priorityQueue.peek());
            const current = priorityQueue.deq();
            const currentNode = current.node;
            const currentCost = costs.get(currentNode.id) || 0;
        
            // Skip processing if a better path has been found already
            if (current.cost > currentCost) {
                console.log(`Skipping node ${currentNode.name} as a better path has been found.`);
                continue;
            }
        
            console.log(`Dequeued node: ${currentNode.name}, Cost: ${current.cost}, Line: ${current.lineId || 'None'}`);
        
            if (currentNode.id === targetId) {
                console.log("Reached target node, breaking loop.");
                break;
            }
    
            currentNode.edges.forEach(edge => {
                const nextNode = edge.target;
                const edgeCost = 0;
                const lineChangeCost = (current.lineId && !edge.lines.has(current.lineId)) ? lineChangePenalty : 0;
                const newCost = currentCost + edgeCost + lineChangeCost;
        
                console.log(`Considering edge: ${currentNode.name} -> ${nextNode.name}, Current Cost: ${currentCost}, Edge Cost: ${edgeCost}, Line Change Cost: ${lineChangeCost}, New Cost: ${newCost}`);
        
                if (newCost < (costs.get(nextNode.id) || Infinity)) {
                    console.log(`Updating cost for node: ${nextNode.name}, from ${costs.get(nextNode.id)} to ${newCost}`);
                    costs.set(nextNode.id, newCost);
                    previous.set(nextNode.id, { nodeId: currentNode.id, lineId: this.getLineForEdge(currentNode.id, nextNode.id) });
                    priorityQueue.enq({ node: nextNode, lineId: this.getLineForEdge(currentNode.id, nextNode.id), cost: newCost });
                }
            });
        }

        // Reconstruct path from previous map to return
        return this.reconstructPath(previous, startId, targetId);
    }

    // Find the line ID for the edge between two nodes
    private getLineForEdge(sourceId: string, targetId: string): string | null {
        const sourceNode = this.nodes.get(sourceId);
        const targetNode = this.nodes.get(targetId);
        if (!sourceNode || !targetNode) {
            return null;
        }

        const commonLines = new Set([...sourceNode.lines].filter(x => targetNode.lines.has(x)));
        console.log(`Common lines between ${sourceNode.name} and ${targetNode.name}:`, commonLines)
        return commonLines.size > 0 ? commonLines.values().next().value : null;
    }

    // Reconstruct the path from the previous map
    private reconstructPath(previous: Map<string, { nodeId: string, lineId: string | null }>, startId: string, targetId: string): { path: string[], lines: string[] } {
        const path = [];
        const lines = [];
        let currentId = targetId;
        while (currentId !== startId) {
            const previousNode = previous.get(currentId);
            if (!previousNode) {
                break;
            }
            console.log(`Reconstructing path. Current node: ${this.nodes.get(currentId)?.name}, Line: ${previousNode.lineId}`);
            path.unshift(this.nodes.get(currentId)!.name);
            if (previousNode.lineId) {
                lines.unshift(previousNode.lineId);
            }
            currentId = previousNode.nodeId;
        }
        path.unshift(this.nodes.get(startId)!.name); // Add start node at the beginning
        return { path, lines };
    }
}

// Load graph from JSON file, add nodes and edges.
export function loadGraphFromJson(filePath: string): Graph {
	const absolutePath = path.resolve(filePath);
	const jsonString = fs.readFileSync(absolutePath, "utf8");
	const jsonData = JSON.parse(jsonString);

	const graph = new Graph();

	jsonData.nodes.forEach((nodeData: INode) => {
		graph.addNode(nodeData.id, nodeData.name);
	});

    
    jsonData.lines.forEach((lineData: { id: string, name: string, stations: string[] }) => {
        lineData.stations.forEach(stationName => {
            const stationId = graph.getNodeIdByName(stationName);
            const node = graph.nodes.get(stationId);
            if (node) {
                node.lines.add(lineData.id);
            }
        });
    });
    
    jsonData.edges.forEach((edgeData: IEdge) => {
        graph.addEdge(edgeData.sourceId, edgeData.targetId);
    });

	console.log("Graph loaded from JSON file");
	return graph;
}
