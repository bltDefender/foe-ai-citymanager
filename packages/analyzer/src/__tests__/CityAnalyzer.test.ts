import { describe, it, expect } from 'vitest';
import { CityAnalyzer } from '../CityAnalyzer.js';
import type { City, Building, Road } from '@forgemind/core';
import { Era, BuildingCategory, BuildingState, RoadType, makeBuildingId, makeRoadId, makeCityId } from '@forgemind/core';

function makeTestCity(): City {
  const buildings: Building[] = [
    {
      id: makeBuildingId('b1'), entityId: 'main', name: 'Town Hall',
      type: BuildingCategory.MainBuilding, category: BuildingCategory.MainBuilding,
      x: 0, y: 0, width: 4, height: 4, rotation: 0, connected: true, roadRequired: false,
      era: Era.BronzeAge, level: 1, state: BuildingState.Idle, productions: [], bonuses: [], tags: [], metadata: {},
    },
    {
      id: makeBuildingId('b2'), entityId: 'res', name: 'House',
      type: BuildingCategory.Residential, category: BuildingCategory.Residential,
      x: 5, y: 0, width: 2, height: 2, rotation: 0, connected: true, roadRequired: true,
      era: Era.BronzeAge, level: 1, state: BuildingState.Idle, productions: [], bonuses: [], tags: [], metadata: {},
    },
    {
      id: makeBuildingId('b3'), entityId: 'res2', name: 'Isolated House',
      type: BuildingCategory.Residential, category: BuildingCategory.Residential,
      x: 15, y: 15, width: 2, height: 2, rotation: 0, connected: false, roadRequired: true,
      era: Era.BronzeAge, level: 1, state: BuildingState.Idle, productions: [], bonuses: [], tags: [], metadata: {},
    },
  ];

  const roads: Road[] = [
    { id: makeRoadId('r1'), x: 4, y: 0, width: 1, height: 1, roadType: RoadType.Paved, connected: true, era: Era.BronzeAge, metadata: {} },
    { id: makeRoadId('r2'), x: 4, y: 1, width: 1, height: 1, roadType: RoadType.Paved, connected: true, era: Era.BronzeAge, metadata: {} },
  ];

  return {
    id: makeCityId('test'), width: 20, height: 20, era: Era.BronzeAge, owner: 'TestPlayer',
    buildings, roads, statistics: null,
    metadata: { gameVersion: '1', exportDate: new Date(), foeHelperVersion: '1', playerName: 'TestPlayer', era: Era.BronzeAge, source: 'test', checksum: '' },
    analysis: null,
  };
}

describe('CityAnalyzer', () => {
  it('returns city with statistics populated', async () => {
    const analyzer = new CityAnalyzer();
    const city = makeTestCity();
    const analyzed = await analyzer.analyze(city);
    expect(analyzed.statistics).not.toBeNull();
    expect(analyzed.statistics?.buildingCount).toBe(3);
  });

  it('returns city with analysis populated', async () => {
    const analyzer = new CityAnalyzer();
    const city = makeTestCity();
    const analyzed = await analyzer.analyze(city);
    expect(analyzed.analysis).not.toBeNull();
  });

  it('detects disconnected buildings in warnings', async () => {
    const analyzer = new CityAnalyzer();
    const city = makeTestCity();
    const analyzed = await analyzer.analyze(city);
    const warnings = analyzed.analysis?.warnings ?? [];
    const errorWarnings = warnings.filter((w) => w.level === 'Error');
    expect(errorWarnings.length).toBeGreaterThan(0);
  });

  it('populates road graph', async () => {
    const analyzer = new CityAnalyzer();
    const city = makeTestCity();
    const analyzed = await analyzer.analyze(city);
    expect(analyzed.analysis?.roadGraph.nodes.size).toBe(2);
  });

  it('computes reachability', async () => {
    const analyzer = new CityAnalyzer();
    const city = makeTestCity();
    const analyzed = await analyzer.analyze(city);
    expect(analyzed.analysis?.reachability.size).toBe(3);
  });

  it('generates heatmaps', async () => {
    const analyzer = new CityAnalyzer();
    const city = makeTestCity();
    const analyzed = await analyzer.analyze(city);
    expect(analyzed.analysis?.heatmaps.has('roadDistance')).toBe(true);
    expect(analyzed.analysis?.heatmaps.has('density')).toBe(true);
    expect(analyzed.analysis?.heatmaps.has('efficiency')).toBe(true);
  });
});
