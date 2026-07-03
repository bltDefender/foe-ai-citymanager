import { describe, it, expect } from 'vitest';
import { generateRoadDistanceHeatmap, generateDensityHeatmap, generateEfficiencyHeatmap } from '../heatmap/HeatmapGenerator.js';
import type { City, Road } from '@forgemind/core';
import { Era, RoadType, makeRoadId, makeCityId } from '@forgemind/core';

function makeCity(roads: Road[] = []): City {
  return {
    id: makeCityId('test'),
    width: 5, height: 5, era: Era.BronzeAge, owner: 'test',
    buildings: [], roads, statistics: null,
    metadata: { gameVersion: '1', exportDate: new Date(), foeHelperVersion: '1', playerName: 'test', era: Era.BronzeAge, source: 'test', checksum: '' },
    analysis: null,
  };
}

describe('generateRoadDistanceHeatmap', () => {
  it('returns cells for every tile', () => {
    const city = makeCity([{ id: makeRoadId('r1'), x: 2, y: 2, width: 1, height: 1, roadType: RoadType.Paved, connected: true, era: Era.BronzeAge, metadata: {} }]);
    const cells = generateRoadDistanceHeatmap(city);
    expect(cells.length).toBe(25);
  });

  it('road tile itself has distance 0', () => {
    const city = makeCity([{ id: makeRoadId('r1'), x: 2, y: 2, width: 1, height: 1, roadType: RoadType.Paved, connected: true, era: Era.BronzeAge, metadata: {} }]);
    const cells = generateRoadDistanceHeatmap(city);
    const roadCell = cells.find((c) => c.x === 2 && c.y === 2);
    expect(roadCell?.value).toBe(0);
  });
});

describe('generateDensityHeatmap', () => {
  it('returns cells for every tile', () => {
    const city = makeCity();
    const cells = generateDensityHeatmap(city);
    expect(cells.length).toBe(25);
  });

  it('values are between 0 and 1', () => {
    const city = makeCity([{ id: makeRoadId('r1'), x: 2, y: 2, width: 1, height: 1, roadType: RoadType.Paved, connected: true, era: Era.BronzeAge, metadata: {} }]);
    const cells = generateDensityHeatmap(city);
    for (const cell of cells) {
      expect(cell.value).toBeGreaterThanOrEqual(0);
      expect(cell.value).toBeLessThanOrEqual(1);
    }
  });
});

describe('generateEfficiencyHeatmap', () => {
  it('returns cells for every tile', () => {
    const city = makeCity();
    const cells = generateEfficiencyHeatmap(city);
    expect(cells.length).toBe(25);
  });

  it('road tile has value 0.3', () => {
    const city = makeCity([{ id: makeRoadId('r1'), x: 0, y: 0, width: 1, height: 1, roadType: RoadType.Paved, connected: true, era: Era.BronzeAge, metadata: {} }]);
    const cells = generateEfficiencyHeatmap(city);
    const roadCell = cells.find((c) => c.x === 0 && c.y === 0);
    expect(roadCell?.value).toBe(0.3);
  });
});
