import type { City } from '@forgemind/core';
import type { AIOptimizationResponse, ValidationIssue, ValidationResult } from '../types/index.js';
import { ValidationSeverity } from '../types/index.js';

function overlaps(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export class OverlapValidator {
  validate(response: AIOptimizationResponse, city: City): ValidationResult {
    const errors: ValidationIssue[] = [];

    if (!response.layout) {
      return { valid: true, issues: [], warnings: [], errors: [] };
    }

    const cityBuildings = new Map(city.buildings.map((building) => [String(building.id), building]));
    const placements: Array<{ id: string; x: number; y: number; width: number; height: number }> = [];

    for (const building of response.layout.buildings) {
      const original = cityBuildings.get(building.id);
      if (!original) {
        continue;
      }

      placements.push({ id: building.id, x: building.x, y: building.y, width: original.width, height: original.height });
    }

    for (let i = 0; i < placements.length; i += 1) {
      for (let j = i + 1; j < placements.length; j += 1) {
        const a = placements[i]!;
        const b = placements[j]!;
        if (overlaps(a.x, a.y, a.width, a.height, b.x, b.y, b.width, b.height)) {
          errors.push({
            code: 'OVERLAP_BUILDINGS',
            severity: ValidationSeverity.Error,
            message: `Buildings '${a.id}' and '${b.id}' overlap in proposed layout`,
            context: { buildingA: a.id, buildingB: b.id },
          });
        }
      }
    }

    for (const road of response.layout.roads) {
      for (const building of placements) {
        if (overlaps(road.x, road.y, road.width, road.height, building.x, building.y, building.width, building.height)) {
          errors.push({
            code: 'OVERLAP_ROAD_BUILDING',
            severity: ValidationSeverity.Error,
            message: `Road at (${road.x},${road.y}) overlaps building '${building.id}'`,
            context: { roadX: road.x, roadY: road.y, buildingId: building.id },
          });
        }
      }
    }

    return { valid: errors.length === 0, issues: errors, warnings: [], errors };
  }
}
