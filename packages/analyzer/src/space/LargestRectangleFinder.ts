import type { City } from '@forgemind/core';

export function findLargestFreeRectangle(city: City): { x: number; y: number; width: number; height: number } {
  const { width, height } = city;

  const occupied: boolean[][] = Array.from({ length: height }, () => new Array(width).fill(false) as boolean[]);

  for (const building of city.buildings) {
    for (let dy = 0; dy < building.height; dy++) {
      for (let dx = 0; dx < building.width; dx++) {
        const gx = building.x + dx;
        const gy = building.y + dy;
        if (gx >= 0 && gy >= 0 && gx < width && gy < height) {
          const row = occupied[gy];
          if (row) row[gx] = true;
        }
      }
    }
  }

  for (const road of city.roads) {
    for (let dy = 0; dy < road.height; dy++) {
      for (let dx = 0; dx < road.width; dx++) {
        const gx = road.x + dx;
        const gy = road.y + dy;
        if (gx >= 0 && gy >= 0 && gx < width && gy < height) {
          const row = occupied[gy];
          if (row) row[gx] = true;
        }
      }
    }
  }

  const histogram = new Array(width).fill(0) as number[];
  let bestArea = 0;
  let bestRect = { x: 0, y: 0, width: 0, height: 0 };

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const occRow = occupied[row];
      if (occRow && occRow[col]) {
        histogram[col] = 0;
      } else {
        histogram[col] = (histogram[col] ?? 0) + 1;
      }
    }

    const result = largestRectInHistogram(histogram, row);
    if (result.area > bestArea) {
      bestArea = result.area;
      bestRect = result.rect;
    }
  }

  return bestRect;
}

function largestRectInHistogram(
  heights: number[],
  bottomRow: number,
): { area: number; rect: { x: number; y: number; width: number; height: number } } {
  const stack: number[] = [];
  let maxArea = 0;
  let bestRect = { x: 0, y: 0, width: 0, height: 0 };
  const n = heights.length;

  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : (heights[i] ?? 0);
    while (stack.length > 0 && h < (heights[stack[stack.length - 1]!] ?? 0)) {
      const top = stack.pop()!;
      const rectHeight = heights[top] ?? 0;
      const left = stack.length > 0 ? (stack[stack.length - 1]! + 1) : 0;
      const rectWidth = i - left;
      const area = rectHeight * rectWidth;
      if (area > maxArea) {
        maxArea = area;
        bestRect = {
          x: left,
          y: bottomRow - rectHeight + 1,
          width: rectWidth,
          height: rectHeight,
        };
      }
    }
    stack.push(i);
  }

  return { area: maxArea, rect: bestRect };
}
