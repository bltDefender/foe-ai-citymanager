import { describe, expect, it } from 'vitest';
import { BoundsValidator } from '../validators/BoundsValidator.js';
import type { Building, City } from '@forgemind/core';
import { BuildingCategory, BuildingState, Era, makeBuildingId, makeCityId } from '@forgemind/core';
import type { AIOptimizationResponse } from '../types/index.js';

function makeCity(): City {
  const building: Building = {
    id: makeBuildingId('b1'),
    entityId: 'b1',
    name: 'House',
    type: BuildingCategory.Residential,
    category: BuildingCategory.Residential,
    x: 0,
    y: 0,
    width: 2,
    height: 2,
    rotation: 0,
    connected: true,
    roadRequired: true,
    era: Era.BronzeAge,
    level: 1,
    state: BuildingState.Idle,
    productions: [],
    bonuses: [],
    tags: [],
    metadata: {},
  };

  return {
    id: makeCityId('c1'),
    width: 10,
    height: 10,
    era: Era.BronzeAge,
    owner: 'test',
    buildings: [building],
    roads: [],
    statistics: null,
    metadata: {
      gameVersion: '1',
      exportDate: new Date(),
      foeHelperVersion: '1',
      playerName: 'test',
      era: Era.BronzeAge,
      source: 'test',
      checksum: '',
    },
    analysis: null,
  };
}

function makeResponse(x: number, y: number): AIOptimizationResponse {
  return {
    version: '1.0',
    summary: 'Test',
    recommendations: [],
    layout: { buildings: [{ id: 'b1', x, y }], roads: [] },
    warnings: [],
    metadata: { model: 'test', provider: 'test', timestamp: '2024-01-01T00:00:00Z' },
  };
}

describe('BoundsValidator', () => {
  const validator = new BoundsValidator();
  const city = makeCity();

  it('passes when building is within bounds', () => {
    const result = validator.validate(makeResponse(0, 0), city);
    expect(result.valid).toBe(true);
  });

  it('fails when building is outside bounds', () => {
    const result = validator.validate(makeResponse(9, 9), city);
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe('BOUNDS_BUILDING_OUT_OF_BOUNDS');
  });

  it('passes when no layout', () => {
    const response: AIOptimizationResponse = {
      version: '1.0',
      summary: 'Test',
      recommendations: [],
      warnings: [],
      metadata: { model: 'test', provider: 'test', timestamp: '2024-01-01T00:00:00Z' },
    };
    const result = validator.validate(response, city);
    expect(result.valid).toBe(true);
  });
});
