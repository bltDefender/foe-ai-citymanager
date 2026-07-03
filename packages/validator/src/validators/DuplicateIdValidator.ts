import type { AIOptimizationResponse, ValidationIssue, ValidationResult } from '../types/index.js';
import { ValidationSeverity } from '../types/index.js';

export class DuplicateIdValidator {
  validate(response: AIOptimizationResponse): ValidationResult {
    const errors: ValidationIssue[] = [];

    if (!response.layout) {
      return { valid: true, issues: [], warnings: [], errors: [] };
    }

    const seen = new Set<string>();
    for (const building of response.layout.buildings) {
      if (seen.has(building.id)) {
        errors.push({
          code: 'DUPLICATE_BUILDING_ID',
          severity: ValidationSeverity.Error,
          message: `Duplicate building ID '${building.id}' in proposed layout`,
          context: { id: building.id },
        });
      } else {
        seen.add(building.id);
      }
    }

    const seenRecommendations = new Set<string>();
    for (const recommendation of response.recommendations) {
      if (seenRecommendations.has(recommendation.id)) {
        errors.push({
          code: 'DUPLICATE_RECOMMENDATION_ID',
          severity: ValidationSeverity.Error,
          message: `Duplicate recommendation ID '${recommendation.id}'`,
          context: { id: recommendation.id },
        });
      } else {
        seenRecommendations.add(recommendation.id);
      }
    }

    return { valid: errors.length === 0, issues: errors, warnings: [], errors };
  }
}
