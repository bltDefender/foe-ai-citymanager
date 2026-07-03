import type { City, HeatmapCell } from '@forgemind/core';
import { buildRoadGraph } from '../graph/RoadGraphBuilder.js';

export function generateRoadDistanceHeatmap(city: City): HeatmapCell[] {
  const roadGraph = buildRoadGraph(city);
  const cells: HeatmapCell[] = [];

  const distances = new Map<string, number>();
  const queue: Array<{ x: number; y: number; dist: number }> = [];

  for (const node of roadGraph.nodes.values()) {
    const key = `${node.x},${node.y}`;
    distances.set(key, 0);
    queue.push({ x: node.x, y: node.y, dist: 0 });
  }

  const maxDist = Math.max(city.width, city.height);
  let qIdx = 0;
  while (qIdx < queue.length) {
    const current = queue[qIdx++]!;
    const neighbors = [
      { x: current.x - 1, y: current.y },
      { x: current.x + 1, y: current.y },
      { x: current.x, y: current.y - 1 },
      { x: current.x, y: current.y + 1 },
    ];
    for (const n of neighbors) {
      if (n.x < 0 || n.y < 0 || n.x >= city.width || n.y >= city.height) continue;
      const key = `${n.x},${n.y}`;
      if (!distances.has(key)) {
        const d = current.dist + 1;
        distances.set(key, d);
        queue.push({ x: n.x, y: n.y, dist: d });
      }
    }
  }

  for (let y = 0; y < city.height; y++) {
    for (let x = 0; x < city.width; x++) {
      const key = `${x},${y}`;
      const dist = distances.get(key) ?? maxDist;
      const value = Math.min(1, dist / 10);
      cells.push({ x, y, value, label: `Distance: ${dist}` });
    }
  }

  return cells;
}

export function generateDensityHeatmap(city: City): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const radius = 3;

  for (let cy = 0; cy < city.height; cy++) {
    for (let cx = 0; cx < city.width; cx++) {
      let count = 0;
      let total = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= city.width || ny >= city.height) continue;
          total++;
          const occupied = city.buildings.some(
            (b) => nx >= b.x && nx < b.x + b.width && ny >= b.y && ny < b.y + b.height,
          ) || city.roads.some(
            (r) => nx >= r.x && nx < r.x + r.width && ny >= r.y && ny < r.y + r.height,
          );
          if (occupied) count++;
        }
      }
      const value = total > 0 ? count / total : 0;
      cells.push({ x: cx, y: cy, value, label: `Density: ${(value * 100).toFixed(0)}%` });
    }
  }

  return cells;
}

export function generateEfficiencyHeatmap(city: City): HeatmapCell[] {
  const cells: HeatmapCell[] = [];

  for (let y = 0; y < city.height; y++) {
    for (let x = 0; x < city.width; x++) {
      const isRoad = city.roads.some((r) => x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height);
      const isBuilding = city.buildings.some((b) => x >= b.x && x < b.x + b.width && y >= b.y && y < b.y + b.height);
      const value = isBuilding ? 1 : isRoad ? 0.3 : 0;
      const label = isBuilding ? 'Building' : isRoad ? 'Road' : 'Empty';
      cells.push({ x, y, value, label });
    }
  }

  return cells;
}
