import { describe, it, expect } from 'vitest';
import { findLargestFreeRectangle } from '../space/LargestRectangleFinder.js';
import type { City } from '@forgemind/core';
import { Era, BuildingCategory, BuildingState, makeBuildingId, makeCityId } from '@forgemind/core';

function makeEmptyCity(w = 10, h = 10): City {
  return {
    id: makeCityId('test'),
    width: w, height: h, era: Era.BronzeAge, owner: 'test',
    buildings: [], roads: [], statistics: null,
    metadata: { gameVersion: '1', exportDate: new Date(), foeHelperVersion: '1', playerName: 'test', era: Era.BronzeAge, source: 'test', checksum: '' },
    analysis: null,
  };
}

describe('findLargestFreeRectangle', () => {
  it('returns full city for empty city', () => {
    const city = makeEmptyCity(5, 5);
    const rect = findLargestFreeRectangle(city);
    expect(rect.width * rect.height).toBe(25);
  });

  it('excludes occupied tiles', () => {
    const city: City = {
      ...makeEmptyCity(5, 5),
      buildings: [{
        id: makeBuildingId('b1'), entityId: 'b1', name: 'b1',
        type: BuildingCategory.Residential, category: BuildingCategory.Residential,
        x: 0, y: 0, width: 5, height: 3, rotation: 0, connected: true, roadRequired: true,
        era: Era.BronzeAge, level: 1, state: BuildingState.Idle, productions: [], bonuses: [], tags: [], metadata: {},
      }],
    };
    const rect = findLargestFreeRectangle(city);
    expect(rect.width * rect.height).toBe(10);
    expect(rect.height).toBe(2);
  });

  it('finds rectangle when city is half occupied', () => {
    const city: City = {
      ...makeEmptyCity(10, 10),
      buildings: [{
        id: makeBuildingId('b1'), entityId: 'b1', name: 'b1',
        type: BuildingCategory.Residential, category: BuildingCategory.Residential,
        x: 0, y: 0, width: 5, height: 10, rotation: 0, connected: true, roadRequired: true,
        era: Era.BronzeAge, level: 1, state: BuildingState.Idle, productions: [], bonuses: [], tags: [], metadata: {},
      }],
    };
    const rect = findLargestFreeRectangle(city);
    expect(rect.width * rect.height).toBe(50);
  });
});
