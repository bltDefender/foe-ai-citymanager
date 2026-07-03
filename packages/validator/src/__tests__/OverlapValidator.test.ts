import { describe, expect, it } from 'vitest';
import { OverlapValidator } from '../validators/OverlapValidator.js';
import type { Building, City } from '@forgemind/core';
import { BuildingCategory, BuildingState, Era, makeBuildingId, makeCityId } from '@forgemind/core';
import type { AIOptimizationResponse } from '../types/index.js';

function makeCity(): City {
  const b1: Building = {
    id: makeBuildingId('b1'),
    entityId: 'b1',
    name: 'House A',
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

  const b2: Building = {
    id: makeBuildingId('b2'),
    entityId: 'b2',
    name: 'House B',
    type: BuildingCategory.Residential,
    category: BuildingCategory.Residential,
    x: 3,
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
    width: 20,
    height: 20,
    era: Era.BronzeAge,
    owner: 'test',
    buildings: [b1, b2],
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

describe('OverlapValidator', () => {
  const validator = new OverlapValidator();
  const city = makeCity();

  it('passes when buildings do not overlap', () => {
    const response: AIOptimizationResponse = {
      version: '1.0',
      summary: 'Test',
      recommendations: [],
      layout: { buildings: [{ id: 'b1', x: 0, y: 0 }, { id: 'b2', x: 5, y: 0 }], roads: [] },
      warnings: [],
      metadata: { model: 'test', provider: 'test', timestamp: '2024-01-01T00:00:00Z' },
    };
    const result = validator.validate(response, city);
    expect(result.valid).toBe(true);
  });

  it('fails when buildings overlap', () => {
    const response: AIOptimizationResponse = {
      version: '1.0',
      summary: 'Test',
      recommendations: [],
      layout: { buildings: [{ id: 'b1', x: 0, y: 0 }, { id: 'b2', x: 1, y: 0 }], roads: [] },
      warnings: [],
      metadata: { model: 'test', provider: 'test', timestamp: '2024-01-01T00:00:00Z' },
    };
    const result = validator.validate(response, city);
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe('OVERLAP_BUILDINGS');
  });
});
