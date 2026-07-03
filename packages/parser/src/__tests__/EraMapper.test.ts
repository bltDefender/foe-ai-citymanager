import { describe, it, expect } from 'vitest';
import { mapEra } from '../mappers/EraMapper.js';
import { Era } from '@forgemind/core';

describe('mapEra', () => {
  it('maps full era names', () => {
    expect(mapEra('BronzeAge')).toBe(Era.BronzeAge);
    expect(mapEra('EarlyMiddleAges')).toBe(Era.EarlyMiddleAges);
    expect(mapEra('ModernEra')).toBe(Era.ModernEra);
    expect(mapEra('SpaceAgeMars')).toBe(Era.SpaceAgeMars);
  });

  it('maps abbreviations', () => {
    expect(mapEra('BA')).toBe(Era.BronzeAge);
    expect(mapEra('EMA')).toBe(Era.EarlyMiddleAges);
    expect(mapEra('ME')).toBe(Era.ModernEra);
  });

  it('returns Unknown for null/undefined', () => {
    expect(mapEra(null)).toBe(Era.Unknown);
    expect(mapEra(undefined)).toBe(Era.Unknown);
  });

  it('returns Unknown for unrecognized era', () => {
    expect(mapEra('SomeFutureEra')).toBe(Era.Unknown);
  });

  it('handles case-insensitive matching', () => {
    expect(mapEra('bronzeage')).toBe(Era.BronzeAge);
  });
});
