import fs from "fs";
import path from "path";

interface INode {
    id: string;
    name: string;
}

interface IEdge {
    sourceId: string;
    targetId: string;}

class Node {
    id: string;
    name: string;
    edges: Edge[];

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.edges = [];
    }
}

class Edge {
    source: Node;
    target: Node;

    constructor(source: Node, target: Node) {
        this.source = source;
        this.target = target;
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
        this.nodes.set(id, node); // Use ID as key
        return node;
    }

    addEdge(sourceId: string, targetId: string): void {
        const sourceNode = this.nodes.get(sourceId);
        const targetNode = this.nodes.get(targetId);
        if (sourceNode && targetNode) {
            // Add edge from source to target
            let edge = new Edge(sourceNode, targetNode);
            sourceNode.edges.push(edge);
            this.edges.push(edge);
    
            // Add edge from target back to source for undirected graph
            edge = new Edge(targetNode, sourceNode);
            targetNode.edges.push(edge);
            this.edges.push(edge);
        } else {
            throw new Error(`Edge with undefined node: ${sourceId} -> ${targetId}`);
        }
    }

    findShortestPathBFS(startId: string, targetId: string): string[] {
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

        if(startId === targetId) {
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

                console.log(`Target node ${this.nodes.get(targetId)?.name} found. Building path...`);

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

        console.log(`Target node ${this.nodes.get(targetId)?.name} not reachable from ${startNode.name}`);
        return [];
    }

    getNodeIdByName(name: string): string {
        let nodeId: string = '';
        this.nodes.forEach((node) => {
            if (node.name === name) {
                nodeId = node.id;
            }
        });
        return nodeId;
    }
    
}

export function loadGraphFromJson(filePath: string): Graph {
    const absolutePath = path.resolve(filePath);
    const jsonString = fs.readFileSync(absolutePath, "utf8");
    const jsonData = JSON.parse(jsonString);

    const graph = new Graph();

    jsonData.nodes.forEach((nodeData: INode) => {
        graph.addNode(nodeData.id, nodeData.name);
    });

    jsonData.edges.forEach((edgeData: IEdge) => {
        graph.addEdge(edgeData.sourceId, edgeData.targetId);
    });

    console.log("Graph loaded from JSON file");
    return graph;
}
