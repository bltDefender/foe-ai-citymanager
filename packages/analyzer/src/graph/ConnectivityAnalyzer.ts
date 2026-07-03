import type { City, RoadGraph, BuildingId } from '@forgemind/core';

export function analyzeConnectivity(city: City, roadGraph: RoadGraph): Map<BuildingId, boolean> {
  const reachability = new Map<BuildingId, boolean>();

  for (const building of city.buildings) {
    if (!building.roadRequired) {
      reachability.set(building.id, true);
      continue;
    }

    let isConnected = false;
    outer:
    for (let dx = 0; dx < building.width; dx++) {
      for (let dy = 0; dy < building.height; dy++) {
        const bx = building.x + dx;
        const by = building.y + dy;
        const adjacent = [
          `${bx - 1},${by}`,
          `${bx + 1},${by}`,
          `${bx},${by - 1}`,
          `${bx},${by + 1}`,
        ];
        for (const key of adjacent) {
          if (roadGraph.nodes.has(key)) {
            isConnected = true;
            break outer;
          }
        }
      }
    }
    reachability.set(building.id, isConnected);
  }

  return reachability;
}

export function detectDeadEnds(roadGraph: RoadGraph): Array<{ x: number; y: number }> {
  const deadEnds: Array<{ x: number; y: number }> = [];
  for (const node of roadGraph.nodes.values()) {
    if (node.connections.length === 1) {
      deadEnds.push({ x: node.x, y: node.y });
    }
  }
  return deadEnds;
}

export function findConnectedComponents(roadGraph: RoadGraph): Array<Set<string>> {
  const visited = new Set<string>();
  const components: Array<Set<string>> = [];

  for (const nodeId of roadGraph.nodes.keys()) {
    if (visited.has(nodeId)) continue;
    const component = new Set<string>();
    const queue = [nodeId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      component.add(current);
      const node = roadGraph.nodes.get(current);
      if (node) {
        for (const conn of node.connections) {
          if (!visited.has(conn)) queue.push(conn);
        }
      }
    }
    components.push(component);
  }

  return components;
}
