import { describe, it, expect } from 'vitest';
import { calculateStatistics } from '../statistics/StatisticsCalculator.js';
import type { City, Building, Road } from '@forgemind/core';
import { Era, BuildingCategory, BuildingState, RoadType, makeBuildingId, makeRoadId, makeCityId } from '@forgemind/core';

function makeCity(buildings: Building[], roads: Road[], width = 20, height = 20): City {
  return {
    id: makeCityId('test'),
    width, height, era: Era.BronzeAge, owner: 'test',
    buildings, roads, statistics: null,
    metadata: { gameVersion: '1', exportDate: new Date(), foeHelperVersion: '1', playerName: 'test', era: Era.BronzeAge, source: 'test', checksum: '' },
    analysis: null,
  };
}

function makeBuilding(id: string, cat: BuildingCategory, x: number, y: number, w = 2, h = 2): Building {
  return {
    id: makeBuildingId(id), entityId: id, name: id, type: cat, category: cat,
    x, y, width: w, height: h, rotation: 0, connected: true, roadRequired: true,
    era: Era.BronzeAge, level: 1, state: BuildingState.Idle, productions: [], bonuses: [], tags: [], metadata: {},
  };
}

function makeRoad(id: string, x: number, y: number): Road {
  return { id: makeRoadId(id), x, y, width: 1, height: 1, roadType: RoadType.Paved, connected: true, era: Era.BronzeAge, metadata: {} };
}

describe('calculateStatistics', () => {
  it('counts tiles correctly', () => {
    const city = makeCity(
      [makeBuilding('b1', BuildingCategory.Residential, 0, 0, 2, 2)],
      [makeRoad('r1', 2, 0), makeRoad('r2', 2, 1)],
      10, 10,
    );
    const stats = calculateStatistics(city);
    expect(stats.tileCount).toBe(100);
    expect(stats.buildingTiles).toBe(4);
    expect(stats.roadTiles).toBe(2);
    expect(stats.occupiedTiles).toBe(6);
    expect(stats.unusedTiles).toBe(94);
  });

  it('calculates percentages', () => {
    const city = makeCity(
      [makeBuilding('b1', BuildingCategory.Residential, 0, 0, 2, 2)],
      [makeRoad('r1', 2, 0)],
      10, 10,
    );
    const stats = calculateStatistics(city);
    expect(stats.roadPercentage).toBeCloseTo(1);
    expect(stats.efficiency).toBeCloseTo(4 / 5);
  });

  it('counts great buildings', () => {
    const city = makeCity(
      [
        makeBuilding('gb1', BuildingCategory.GreatBuilding, 0, 0, 4, 4),
        makeBuilding('gb2', BuildingCategory.GreatBuilding, 5, 0, 3, 3),
        makeBuilding('res1', BuildingCategory.Residential, 9, 0, 2, 2),
      ],
      [],
      20, 20,
    );
    const stats = calculateStatistics(city);
    expect(stats.greatBuildingCount).toBe(2);
    expect(stats.buildingCount).toBe(3);
  });

  it('counts category tiles', () => {
    const city = makeCity(
      [
        makeBuilding('d1', BuildingCategory.Decoration, 0, 0, 1, 1),
        makeBuilding('c1', BuildingCategory.Culture, 1, 0, 2, 2),
        makeBuilding('m1', BuildingCategory.Military, 4, 0, 3, 2),
      ],
      [],
      20, 20,
    );
    const stats = calculateStatistics(city);
    expect(stats.decorationTiles).toBe(1);
    expect(stats.cultureTiles).toBe(4);
    expect(stats.militaryTiles).toBe(6);
  });

  it('handles empty city', () => {
    const city = makeCity([], [], 10, 10);
    const stats = calculateStatistics(city);
    expect(stats.tileCount).toBe(100);
    expect(stats.occupiedTiles).toBe(0);
    expect(stats.efficiency).toBe(0);
  });
});
