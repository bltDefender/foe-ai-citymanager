import type { City } from '@forgemind/core';
import type { AIOptimizationResponse, ValidationIssue, ValidationResult } from '../types/index.js';
import { ValidationSeverity } from '../types/index.js';

export class BoundsValidator {
  validate(response: AIOptimizationResponse, city: City): ValidationResult {
    const errors: ValidationIssue[] = [];

    if (!response.layout) {
      return { valid: true, issues: [], warnings: [], errors: [] };
    }

    const cityBuildings = new Map(city.buildings.map((building) => [String(building.id), building]));

    for (const building of response.layout.buildings) {
      const original = cityBuildings.get(building.id);
      if (!original) {
        continue;
      }

      if (
        building.x < 0 ||
        building.y < 0 ||
        building.x + original.width > city.width ||
        building.y + original.height > city.height
      ) {
        errors.push({
          code: 'BOUNDS_BUILDING_OUT_OF_BOUNDS',
          severity: ValidationSeverity.Error,
          message: `Building '${building.id}' at (${building.x},${building.y}) is outside city bounds`,
          context: {
            buildingId: building.id,
            x: building.x,
            y: building.y,
            cityWidth: city.width,
            cityHeight: city.height,
          },
        });
      }
    }

    for (const road of response.layout.roads) {
      if (road.x < 0 || road.y < 0 || road.x + road.width > city.width || road.y + road.height > city.height) {
        errors.push({
          code: 'BOUNDS_ROAD_OUT_OF_BOUNDS',
          severity: ValidationSeverity.Error,
          message: `Road at (${road.x},${road.y}) with size ${road.width}x${road.height} is outside city bounds`,
          context: { x: road.x, y: road.y, width: road.width, height: road.height },
        });
      }
    }

    return {
      valid: errors.length === 0,
      issues: errors,
      warnings: [],
      errors,
    };
  }
}
