import fs from "fs";
import path from "path";
import PriorityQueue from "priorityqueuejs";

interface INode {
	id: string;
	name: string;
}

interface IEdge {
	sourceId: string;
	targetId: string;
	lines: Set<string>;
}

class Node {
	id: string;
	name: string;
	lines: Set<string>;
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
	lines: Set<string>;
	weight: number;

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

	addNode(id: string, name: string): Node {
		const node = new Node(id, name);
		this.nodes.set(id, node);
		return node;
	}

	addEdge(sourceId: string, targetId: string): void {
		const sourceNode = this.nodes.get(sourceId);
		const targetNode = this.nodes.get(targetId);

		let edgeWeight = 1;
		if (sourceNode && targetNode) {
			const existingEdge = sourceNode.edges.find(
				(edge) => edge.target === targetNode
			);
			if (existingEdge) {
				throw new Error(
					`Edge already exists: ${sourceId} -> ${targetId}`
				);
			}
			const sourceLines = [...sourceNode.lines];
			const sourceEdgeLines = sourceLines.filter((line) =>
				targetNode.lines.has(line)
			);

			if (sourceEdgeLines.length === 0) {
				edgeWeight = 10;
				const targetLinesArray = Array.from(targetNode.lines);
				const sourceLinesArray = Array.from(sourceNode.lines);
				sourceEdgeLines.push(
					`${sourceLinesArray[0]} level-change ${targetLinesArray[0]}`
				);
			}
			let edge = new Edge(
				sourceNode,
				targetNode,
				sourceEdgeLines,
				edgeWeight
			);
			sourceNode.edges.push(edge);
			this.edges.push(edge);

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

	// Use of BFS to find the shortest path
	findShortestPath(
		startId: string,
		targetId: string
	): { path: string[]; lines: string[] } {
		const visited = new Map<string, boolean>();
		const previous = new Map<string, string | null>();
		const queue: Node[] = [];

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
				break;
			}
		}

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
		let lastUsedLine: string | null = null;

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

				const getLevel = (line: string) => line.split("-")[0];

				if (lastUsedLine && commonLines.has(lastUsedLine)) {
					line = lastUsedLine;
				} else if (commonLines.size > 0) {
					const preferredLines = Array.from(commonLines).filter(
						(l) =>
							lastUsedLine &&
							getLevel(l) === getLevel(lastUsedLine)
					);
					if (preferredLines.length > 0) {
						line = preferredLines[0];
					} else {
						line = commonLines.values().next().value;
					}
					lastUsedLine = line;
				} else {
					if (
						lastUsedLine &&
						getLevel(lastUsedLine) !==
							getLevel(Array.from(currentNode.lines)[0])
					) {
						line = `level-change:${lastUsedLine}->${
							Array.from(currentNode.lines)[0]
						}`;
					} else {
						line = Array.from(currentNode.lines)[0];
					}
					lastUsedLine = null;
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
