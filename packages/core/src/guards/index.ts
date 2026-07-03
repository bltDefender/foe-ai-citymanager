import type { Building } from '../models/Building.js';
import type { Road } from '../models/Road.js';
import type { City } from '../models/City.js';
import { BuildingCategory } from '../models/BuildingCategory.js';
import { RoadType } from '../models/RoadType.js';

export function isBuilding(value: unknown): value is Building {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['entityId'] === 'string' &&
    typeof obj['name'] === 'string' &&
    typeof obj['x'] === 'number' &&
    typeof obj['y'] === 'number' &&
    typeof obj['width'] === 'number' &&
    typeof obj['height'] === 'number' &&
    typeof obj['category'] === 'string' &&
    Object.values(BuildingCategory).includes(obj['category'] as BuildingCategory)
  );
}

export function isRoad(value: unknown): value is Road {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['x'] === 'number' &&
    typeof obj['y'] === 'number' &&
    typeof obj['width'] === 'number' &&
    typeof obj['height'] === 'number' &&
    typeof obj['roadType'] === 'string' &&
    Object.values(RoadType).includes(obj['roadType'] as RoadType)
  );
}

export function isCity(value: unknown): value is City {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['width'] === 'number' &&
    typeof obj['height'] === 'number' &&
    Array.isArray(obj['buildings']) &&
    Array.isArray(obj['roads'])
  );
}
