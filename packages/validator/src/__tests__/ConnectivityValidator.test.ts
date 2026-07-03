import { describe, expect, it } from 'vitest';
import { ConnectivityValidator } from '../validators/ConnectivityValidator.js';
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

describe('ConnectivityValidator', () => {
  const validator = new ConnectivityValidator();
  const city = makeCity();

  it('passes when building is adjacent to road', () => {
    const response: AIOptimizationResponse = {
      version: '1.0',
      summary: 'Test',
      recommendations: [],
      layout: {
        buildings: [{ id: 'b1', x: 0, y: 0 }],
        roads: [{ x: 2, y: 0, width: 1, height: 1 }],
      },
      warnings: [],
      metadata: { model: 'test', provider: 'test', timestamp: '2024-01-01T00:00:00Z' },
    };
    const result = validator.validate(response, city);
    expect(result.valid).toBe(true);
  });

  it('fails when building is not adjacent to any road', () => {
    const response: AIOptimizationResponse = {
      version: '1.0',
      summary: 'Test',
      recommendations: [],
      layout: {
        buildings: [{ id: 'b1', x: 0, y: 0 }],
        roads: [{ x: 8, y: 8, width: 1, height: 1 }],
      },
      warnings: [],
      metadata: { model: 'test', provider: 'test', timestamp: '2024-01-01T00:00:00Z' },
    };
    const result = validator.validate(response, city);
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe('CONNECTIVITY_BUILDING_DISCONNECTED');
  });
});
