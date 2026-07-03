import type { City } from '@forgemind/core';
import type { AIOptimizationResponse, ValidationIssue, ValidationResult } from '../types/index.js';
import { ValidationSeverity } from '../types/index.js';

export class UnknownBuildingValidator {
  validate(response: AIOptimizationResponse, city: City): ValidationResult {
    const errors: ValidationIssue[] = [];
    const buildingIds = new Set(city.buildings.map((building) => String(building.id)));

    if (response.layout) {
      for (const building of response.layout.buildings) {
        if (!buildingIds.has(building.id)) {
          errors.push({
            code: 'UNKNOWN_BUILDING_ID',
            severity: ValidationSeverity.Error,
            message: `Layout references unknown building ID '${building.id}'`,
            context: { id: building.id },
          });
        }
      }
    }

    for (const recommendation of response.recommendations) {
      if (recommendation.buildingId && !buildingIds.has(recommendation.buildingId)) {
        errors.push({
          code: 'UNKNOWN_RECOMMENDATION_BUILDING',
          severity: ValidationSeverity.Error,
          message: `Recommendation '${recommendation.id}' references unknown building '${recommendation.buildingId}'`,
          context: { recommendationId: recommendation.id, buildingId: recommendation.buildingId },
        });
      }
    }

    return { valid: errors.length === 0, issues: errors, warnings: [], errors };
  }
}
