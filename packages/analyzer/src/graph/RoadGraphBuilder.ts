import type { City, RoadGraph, RoadNode } from '@forgemind/core';

export function buildRoadGraph(city: City): RoadGraph {
  const nodes = new Map<string, RoadNode>();
  const roadSet = new Set<string>();

  for (const road of city.roads) {
    for (let dy = 0; dy < road.height; dy++) {
      for (let dx = 0; dx < road.width; dx++) {
        const key = `${road.x + dx},${road.y + dy}`;
        roadSet.add(key);
        if (!nodes.has(key)) {
          nodes.set(key, {
            id: key,
            x: road.x + dx,
            y: road.y + dy,
            connections: [],
          });
        }
      }
    }
  }

  const edges: Array<{ from: string; to: string; weight: number }> = [];

  for (const [key, node] of nodes) {
    const neighbors = [
      `${node.x - 1},${node.y}`,
      `${node.x + 1},${node.y}`,
      `${node.x},${node.y - 1}`,
      `${node.x},${node.y + 1}`,
    ];
    const newConnections: string[] = [];
    for (const neighborKey of neighbors) {
      if (roadSet.has(neighborKey)) {
        newConnections.push(neighborKey);
        if (key < neighborKey) {
          edges.push({ from: key, to: neighborKey, weight: 1 });
        }
      }
    }
    nodes.set(key, { ...node, connections: newConnections });
  }

  return { nodes, edges };
}
