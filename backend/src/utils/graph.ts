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
	lines: Set<string>;
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
	lines: Set<string>; // Add this line
	weight: number; // Add this line

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

		let edgeWeight = 1; // All edges have the same weight
		if (sourceNode && targetNode) {
			const existingEdge = sourceNode.edges.find(
				(edge) => edge.target === targetNode
			);
			if (existingEdge) {
				throw new Error(
					`Edge already exists: ${sourceId} -> ${targetId}`
				);
			}
			// Determine the common lines between the source and target nodes
			const sourceLines = [...sourceNode.lines];
			const sourceEdgeLines = sourceLines.filter((line) =>
				targetNode.lines.has(line)
			);

			if (sourceEdgeLines.length === 0) {
				edgeWeight = 10; // Add a penalty for changing levels
				const targetLinesArray = Array.from(targetNode.lines);
				const sourceLinesArray = Array.from(sourceNode.lines);
				sourceEdgeLines.push(
					`${sourceLinesArray[0]} level-change ${targetLinesArray[0]}`
				);
			}
			// Add edge from source to target
			let edge = new Edge(
				sourceNode,
				targetNode,
				sourceEdgeLines,
				edgeWeight
			);
			sourceNode.edges.push(edge);
			this.edges.push(edge);
			// print edge

			// Add same lines for the edge from target to source
			const targetLines = [...targetNode.lines];
			const targetEdgeLines = targetLines.filter((line) =>
				sourceNode.lines.has(line)
			);

			if (targetEdgeLines.length === 0) {
				edgeWeight = 10;
				const targetLinesArray = Array.from(targetNode.lines);
				const sourceLinesArray = Array.from(sourceNode.lines);
				targetEdgeLines.push(
					`${targetLinesArray[0]} level-change ${sourceLinesArray[0]}`
				);
			}

			// Add edge from target back to source for undirected graph
			edge = new Edge(
				targetNode,
				sourceNode,
				targetEdgeLines,
				edgeWeight
			);
			targetNode.edges.push(edge);
			this.edges.push(edge);
		} else {
			throw new Error(
				`Edge with undefined node: ${sourceId} -> ${targetId}`
			);
		}
	}

	// Make use of BFS to find the shortest path, no matter how many transfers
	findShortestPath(
		startId: string,
		targetId: string
	): { path: string[]; lines: string[] } {
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
			return { path: [], lines: [] };
		}

		if (startId === targetId) {
			console.log(`Start node and target node are the same.`);
			return { path: [startNode.name], lines: [] };
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
				const lines = this.calculateLines(path);
				return { path, lines };
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

		return { path: [], lines: [] };
	}

	// Input node name and return ID
	getNodeIdByName(name: string): string {
		let nodeId: string = "";
		this.nodes.forEach((node) => {
			if (node.name === name) {
				nodeId = node.id;
			}
		});

		if (nodeId === "") {
			throw new Error(`Node ID not found for name: ${name}`);
		}

		return nodeId;
	}

	// Find the optimal path using a modified Dijkstra's algorithm.
	findOptimalPath(
		startId: string,
		targetId: string
	): { path: string[]; lines: string[] } {
		const costs = new Map<string, number>();
		const previous = new Map<string, string>();
		const priorityQueue = new PriorityQueue<{
			nodeId: string;
			cost: number;
		}>((a, b) => a.cost - b.cost);
		const visited = new Set<string>(); // New set to keep track of visited nodes

		this.nodes.forEach((_, nodeId) => {
			costs.set(nodeId, Infinity);
		});

		costs.set(startId, 0);
		priorityQueue.enq({ nodeId: startId, cost: 0 });

		while (!priorityQueue.isEmpty()) {
			const { nodeId: currentId, cost: currentCost } =
				priorityQueue.deq();

			if (visited.has(currentId)) continue; // Skip if node is already visited
			visited.add(currentId); // Mark the node as visited

			if (currentId === targetId) {
				console.log(
					`Reached target node (${targetId}), breaking loop.`
				);
				break;
			}

			const currentNode = this.nodes.get(currentId);
			if (!currentNode) {
				throw new Error(`Node with ID ${currentId} not found`);
			}
			currentNode.edges.forEach((edge) => {
				const nextId = edge.target.id;
				const transferCost = this.calculateTransferCost(
					currentId,
					nextId,
					previous.get(currentId)
				);
				const newCost = currentCost + edge.weight + transferCost;

				console.log(
					"New Cost: ",
					newCost,
					"Current Cost: ",
					currentCost,
					"Edge Weight: ",
					edge.weight,
					"Transfer Cost: ",
					transferCost
				);

				if (newCost < (costs.get(nextId) || Infinity)) {
					costs.set(nextId, newCost);
					previous.set(nextId, currentId);
					priorityQueue.enq({ nodeId: nextId, cost: newCost });
				}
			});
		}
		return this.reconstructPath(startId, targetId, previous);
	}

	calculateTransferCost(
		currentId: string,
		nextId: string,
		previousId: string | undefined
	): number {
		if (!previousId) return 0;

		const currentLines =
			this.nodes.get(currentId)?.lines ?? new Set<string>();
		const previousLines =
			this.nodes.get(previousId!)?.lines ?? new Set<string>();

		const nextLines = this.nodes.get(nextId)?.lines ?? new Set<string>();
		const lineChangePenalty = 15;

		const commonLines = new Set(
			[...currentLines].filter(
				(x) => nextLines.has(x) && previousLines.has(x)
			)
		);
		//if it contains level-change, return 5 please

		return commonLines.size > 0 ? 0 : lineChangePenalty;
	}

	reconstructPath(
		startId: string,
		targetId: string,
		previous: Map<string, string>
	): { path: string[]; lines: string[] } {
		const path = [];
		let currentId = targetId;

		while (currentId && currentId !== startId) {
			const currentNode = this.nodes.get(currentId);
			if (currentNode) {
				path.unshift(currentNode.name);
				currentId = previous.get(currentId)!;
			} else {
				console.error(
					`Node with ID ${currentId} not found. Check if node IDs are correct and match those in the 'nodes' map.`
				);
				break; // Exit the loop if a node is not found
			}
		}

		// Check if the start node is correctly added
		if (currentId === startId) {
			path.unshift(this.nodes.get(startId)?.name ?? "Unknown");
		} else {
			console.error(
				`Start node with ID ${startId} was not reached. Path reconstruction incomplete.`
			);
		}

		const lines = this.calculateLines(path);
		return { path, lines };
	}

	calculateLines(path: string[]): string[] {
		const lines = [];
		let lastUsedLine: string | null = null; // Track the last used line with format "level-line"

		for (let i = 1; i < path.length; i++) {
			const currentNodeId = this.getNodeIdByName(path[i]);
			const previousNodeId = this.getNodeIdByName(path[i - 1]);
			const currentNode = this.nodes.get(currentNodeId);
			const previousNode = this.nodes.get(previousNodeId);

			if (currentNode && previousNode) {
				const commonLines = new Set(
					[...currentNode.lines].filter((x) =>
						previousNode.lines.has(x)
					)
				);
				let line: string;

				// Function to extract level from the line identifier
				const getLevel = (line: string) => line.split("-")[0];

				// Determine if a level change or transfer is necessary
				if (lastUsedLine && commonLines.has(lastUsedLine)) {
					// Continue using the same line if possible
					line = lastUsedLine;
				} else if (commonLines.size > 0) {
					// If there are common lines, pick one that continues the last level if possible
					const preferredLines = Array.from(commonLines).filter(
						(l) =>
							lastUsedLine &&
							getLevel(l) === getLevel(lastUsedLine)
					);
					if (preferredLines.length > 0) {
						// Continue on the same level if possible
						line = preferredLines[0];
					} else {
						// Otherwise, just pick the first common line
						line = commonLines.values().next().value;
					}
					lastUsedLine = line; // Update the last used line
				} else {
					// Handle level change or transfer
					if (
						lastUsedLine &&
						getLevel(lastUsedLine) !==
							getLevel(Array.from(currentNode.lines)[0])
					) {
						// Level change if the first part of the line identifier changes
						line = `level-change:${lastUsedLine}->${
							Array.from(currentNode.lines)[0]
						}`;
					} else {
						// Transfer within the same level
						line = Array.from(currentNode.lines)[0];
					}
					lastUsedLine = null; // Potentially reset last used line as it's a change
				}
				lines.push(line);
			} else {
				console.log(
					`Node with ID ${currentNodeId} or ${previousNodeId} not found`
				);
			}
		}
		console.log(`Calculated Lines: ${lines}`);
		return lines;
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

	jsonData.lines.forEach(
		(lineData: { id: string; name: string; stations: string[] }) => {
			lineData.stations.forEach((stationName) => {
				const stationId = graph.getNodeIdByName(stationName);
				const node = graph.nodes.get(stationId);
				if (node) {
					node.lines.add(lineData.id);
				}
			});
		}
	);

	jsonData.edges.forEach((edgeData: IEdge) => {
		graph.addEdge(edgeData.sourceId, edgeData.targetId);
	});

	/*    jsonData.edges.forEach((edge: IEdge) => {
        // check if node has lines
		    console.log(`Lines: ${edge.lines}, Source: ${edge.sourceId}, Target: ${edge.targetId}`);
	}); */

	console.log("Graph loaded from JSON file");
	return graph;
}

export function getStationsWithLevels(
	filePath: string
): { name: string; level: number }[] {
	const absolutePath = path.resolve(filePath);
	const jsonString = fs.readFileSync(absolutePath, "utf8");
	const jsonData = JSON.parse(jsonString);
	const stationsWithLevels: { name: string; level: number }[] = [];

	jsonData.lines.forEach(
		(lineData: { id: string; name: string; stations: string[] }) => {
			const level = parseInt(lineData.id.split("-")[0]);
			lineData.stations.forEach((stationName) => {
				// Check if the station with the same name and level already exists
				if (
					!stationsWithLevels.some(
						(station) =>
							station.name === stationName &&
							station.level === level
					)
				) {
					stationsWithLevels.push({
						name: stationName,
						level: level,
					});
				}
			});
		}
	);

	return stationsWithLevels;
}
