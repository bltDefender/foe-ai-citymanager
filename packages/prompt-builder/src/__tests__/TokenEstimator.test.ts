import { describe, expect, it } from 'vitest';
import { estimateCost, estimateTokens, MODEL_PRICING } from '../estimator/TokenEstimator.js';

describe('estimateTokens', () => {
  it('estimates tokens as chars/4', () => {
    expect(estimateTokens('Hello')).toBe(2);
    expect(estimateTokens('Hello World')).toBe(3);
  });

  it('returns 0 for empty string', () => {
    expect(estimateTokens('')).toBe(0);
  });
});

describe('estimateCost', () => {
  it('calculates cost for known model', () => {
    const cost = estimateCost(1000, 500, 'gpt-4o');
    expect(cost.input).toBeCloseTo(0.005);
    expect(cost.output).toBeCloseTo(0.0075);
    expect(cost.total).toBeCloseTo(0.0125);
  });

  it('uses default pricing for unknown model', () => {
    const cost = estimateCost(1000, 500, 'unknown-model');
    expect(cost.total).toBeGreaterThan(0);
  });
});

describe('MODEL_PRICING', () => {
  it('has pricing for major models', () => {
    expect(MODEL_PRICING['gpt-4o']).toBeDefined();
    expect(MODEL_PRICING['claude-opus-4-5']).toBeDefined();
    expect(MODEL_PRICING['gemini-1.5-pro']).toBeDefined();
  });
});
