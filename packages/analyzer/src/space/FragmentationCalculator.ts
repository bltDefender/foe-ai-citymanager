import type { City } from '@forgemind/core';

export function calculateFragmentation(city: City): number {
  const { width, height } = city;
  const totalTiles = width * height;

  const freeKeys = new Set<string>();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      freeKeys.add(`${x},${y}`);
    }
  }

  for (const building of city.buildings) {
    for (let dy = 0; dy < building.height; dy++) {
      for (let dx = 0; dx < building.width; dx++) {
        freeKeys.delete(`${building.x + dx},${building.y + dy}`);
      }
    }
  }

  for (const road of city.roads) {
    for (let dy = 0; dy < road.height; dy++) {
      for (let dx = 0; dx < road.width; dx++) {
        freeKeys.delete(`${road.x + dx},${road.y + dy}`);
      }
    }
  }

  if (freeKeys.size === 0 || totalTiles === 0) return 0;

  const visited = new Set<string>();
  let componentCount = 0;

  for (const key of freeKeys) {
    if (visited.has(key)) continue;
    componentCount++;
    const queue = [key];
    while (queue.length > 0) {
      const cur = queue.shift()!;
      if (visited.has(cur)) continue;
      visited.add(cur);
      const [xs, ys] = cur.split(',');
      const x = Number.parseInt(xs ?? '0', 10);
      const y = Number.parseInt(ys ?? '0', 10);
      const neighbors = [`${x - 1},${y}`, `${x + 1},${y}`, `${x},${y - 1}`, `${x},${y + 1}`];
      for (const neighbor of neighbors) {
        if (freeKeys.has(neighbor) && !visited.has(neighbor)) queue.push(neighbor);
      }
    }
  }

  if (componentCount <= 1) return 0;
  const freeFraction = freeKeys.size / totalTiles;
  return Math.min(1, (componentCount - 1) / (freeKeys.size * freeFraction + 1));
}
