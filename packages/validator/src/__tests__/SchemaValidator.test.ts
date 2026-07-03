import { describe, expect, it } from 'vitest';
import { SchemaValidator } from '../validators/SchemaValidator.js';

const validResponse = {
  version: '1.0',
  summary: 'Test optimization',
  recommendations: [
    {
      id: 'rec-1',
      reason: 'Reduce roads',
      priority: 8,
      confidence: 0.9,
      impact: 0.7,
      action: 'remove',
      dependencies: [],
      tradeoffs: [],
    },
  ],
  warnings: [],
  metadata: { model: 'gpt-4o', provider: 'openai', timestamp: '2024-01-01T00:00:00Z' },
};

describe('SchemaValidator', () => {
  const validator = new SchemaValidator();

  it('validates a correct response', () => {
    const result = validator.validate(validResponse);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects missing required fields', () => {
    const result = validator.validate({ version: '1.0' });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects invalid priority range', () => {
    const invalid = {
      ...validResponse,
      recommendations: [{ ...validResponse.recommendations[0], priority: 15 }],
    };
    const result = validator.validate(invalid);
    expect(result.valid).toBe(false);
  });

  it('rejects invalid action', () => {
    const invalid = {
      ...validResponse,
      recommendations: [{ ...validResponse.recommendations[0], action: 'invalid' }],
    };
    const result = validator.validate(invalid);
    expect(result.valid).toBe(false);
  });
});
