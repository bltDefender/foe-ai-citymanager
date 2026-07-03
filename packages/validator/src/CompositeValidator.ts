import type { City } from '@forgemind/core';
import type { AIOptimizationResponse, ValidationIssue, ValidationResult } from './types/index.js';
import { ValidationSeverity } from './types/index.js';
import { SchemaValidator } from './validators/SchemaValidator.js';
import { BoundsValidator } from './validators/BoundsValidator.js';
import { OverlapValidator } from './validators/OverlapValidator.js';
import { ConnectivityValidator } from './validators/ConnectivityValidator.js';
import { DuplicateIdValidator } from './validators/DuplicateIdValidator.js';
import { UnknownBuildingValidator } from './validators/UnknownBuildingValidator.js';

export class CompositeValidator {
  private readonly schemaValidator = new SchemaValidator();
  private readonly boundsValidator = new BoundsValidator();
  private readonly overlapValidator = new OverlapValidator();
  private readonly connectivityValidator = new ConnectivityValidator();
  private readonly duplicateIdValidator = new DuplicateIdValidator();
  private readonly unknownBuildingValidator = new UnknownBuildingValidator();

  validate(response: unknown, city: City): ValidationResult {
    const schemaResult = this.schemaValidator.validate(response);
    if (!schemaResult.valid) {
      return schemaResult;
    }

    const parsed = response as AIOptimizationResponse;
    const allIssues: ValidationIssue[] = [];

    allIssues.push(...this.boundsValidator.validate(parsed, city).issues);
    allIssues.push(...this.overlapValidator.validate(parsed, city).issues);
    allIssues.push(...this.connectivityValidator.validate(parsed, city).issues);
    allIssues.push(...this.duplicateIdValidator.validate(parsed).issues);
    allIssues.push(...this.unknownBuildingValidator.validate(parsed, city).issues);

    const errors = allIssues.filter((issue) => issue.severity === ValidationSeverity.Error);
    const warnings = allIssues.filter((issue) => issue.severity === ValidationSeverity.Warning);

    return {
      valid: errors.length === 0,
      issues: allIssues,
      warnings,
      errors,
    };
  }
}
