import type { ValidationIssue, ValidationResult } from '../types/index.js';
import { AIOptimizationResponseSchema, ValidationSeverity } from '../types/index.js';

export class SchemaValidator {
  validate(response: unknown): ValidationResult {
    const result = AIOptimizationResponseSchema.safeParse(response);
    if (result.success) {
      return { valid: true, issues: [], warnings: [], errors: [] };
    }

    const errors: ValidationIssue[] = result.error.issues.map((issue) => ({
      code: `SCHEMA_${issue.code.toUpperCase()}`,
      severity: ValidationSeverity.Error,
      message: `Schema validation failed at ${issue.path.join('.')}: ${issue.message}`,
      context: { path: issue.path, zodCode: issue.code },
    }));

    return {
      valid: false,
      issues: errors,
      warnings: [],
      errors,
    };
  }
}
