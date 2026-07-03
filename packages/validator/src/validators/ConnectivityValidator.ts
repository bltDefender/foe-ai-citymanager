import type { City } from '@forgemind/core';
import type { AIOptimizationResponse, ValidationIssue, ValidationResult } from '../types/index.js';
import { ValidationSeverity } from '../types/index.js';

export class ConnectivityValidator {
  validate(response: AIOptimizationResponse, city: City): ValidationResult {
    if (!response.layout) {
      return { valid: true, issues: [], warnings: [], errors: [] };
    }

    const errors: ValidationIssue[] = [];
    const roadSet = new Set<string>();
    const cityBuildings = new Map(city.buildings.map((building) => [String(building.id), building]));

    for (const road of response.layout.roads) {
      for (let dy = 0; dy < road.height; dy += 1) {
        for (let dx = 0; dx < road.width; dx += 1) {
          roadSet.add(`${road.x + dx},${road.y + dy}`);
        }
      }
    }

    for (const building of response.layout.buildings) {
      const original = cityBuildings.get(building.id);
      if (!original || !original.roadRequired) {
        continue;
      }

      let isConnected = false;
      outer: for (let dx = 0; dx < original.width; dx += 1) {
        for (let dy = 0; dy < original.height; dy += 1) {
          const bx = building.x + dx;
          const by = building.y + dy;
          const adjacent = [`${bx - 1},${by}`, `${bx + 1},${by}`, `${bx},${by - 1}`, `${bx},${by + 1}`];
          for (const key of adjacent) {
            if (roadSet.has(key)) {
              isConnected = true;
              break outer;
            }
          }
        }
      }

      if (!isConnected) {
        errors.push({
          code: 'CONNECTIVITY_BUILDING_DISCONNECTED',
          severity: ValidationSeverity.Error,
          message: `Building '${building.id}' requires a road but is not adjacent to any road in the proposed layout`,
          context: { buildingId: building.id, x: building.x, y: building.y },
        });
      }
    }

    return { valid: errors.length === 0, issues: errors, warnings: [], errors };
  }
}
