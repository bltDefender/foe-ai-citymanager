import type { City } from '../models/City.js';
import type { Building } from '../models/Building.js';
import type { Road } from '../models/Road.js';

export function getBuildingAt(city: City, x: number, y: number): Building | null {
  for (const building of city.buildings) {
    if (
      x >= building.x &&
      x < building.x + building.width &&
      y >= building.y &&
      y < building.y + building.height
    ) {
      return building;
    }
  }
  return null;
}

export function getRoadAt(city: City, x: number, y: number): Road | null {
  for (const road of city.roads) {
    if (
      x >= road.x &&
      x < road.x + road.width &&
      y >= road.y &&
      y < road.y + road.height
    ) {
      return road;
    }
  }
  return null;
}

export function getTileAt(city: City, x: number, y: number): Building | Road | null {
  return getBuildingAt(city, x, y) ?? getRoadAt(city, x, y);
}

export function getAdjacentTiles(x: number, y: number): Array<{ x: number; y: number }> {
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];
}

export function isTileOccupied(city: City, x: number, y: number): boolean {
  return getTileAt(city, x, y) !== null;
}

export function tilesOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function isWithinBounds(
  city: City,
  x: number,
  y: number,
  width = 1,
  height = 1,
): boolean {
  return x >= 0 && y >= 0 && x + width <= city.width && y + height <= city.height;
}
