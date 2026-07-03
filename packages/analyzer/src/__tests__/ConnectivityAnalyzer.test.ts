import { describe, it, expect } from 'vitest';
import { analyzeConnectivity, detectDeadEnds, findConnectedComponents } from '../graph/ConnectivityAnalyzer.js';
import { buildRoadGraph } from '../graph/RoadGraphBuilder.js';
import type { City, Building, Road } from '@forgemind/core';
import { Era, BuildingCategory, BuildingState, RoadType, makeBuildingId, makeRoadId, makeCityId } from '@forgemind/core';

function makeCity(buildings: Building[], roads: Road[]): City {
  return {
    id: makeCityId('test'),
    width: 20, height: 20, era: Era.BronzeAge, owner: 'test',
    buildings, roads, statistics: null,
    metadata: { gameVersion: '1', exportDate: new Date(), foeHelperVersion: '1', playerName: 'test', era: Era.BronzeAge, source: 'test', checksum: '' },
    analysis: null,
  };
}

function makeBuilding(id: string, x: number, y: number, roadRequired = true): Building {
  return {
    id: makeBuildingId(id), entityId: id, name: id, type: BuildingCategory.Residential, category: BuildingCategory.Residential,
    x, y, width: 2, height: 2, rotation: 0, connected: true, roadRequired,
    era: Era.BronzeAge, level: 1, state: BuildingState.Idle, productions: [], bonuses: [], tags: [], metadata: {},
  };
}

function makeRoad(id: string, x: number, y: number): Road {
  return { id: makeRoadId(id), x, y, width: 1, height: 1, roadType: RoadType.Paved, connected: true, era: Era.BronzeAge, metadata: {} };
}

describe('analyzeConnectivity', () => {
  it('marks buildings adjacent to roads as connected', () => {
    const building = makeBuilding('b1', 0, 0);
    const road = makeRoad('r1', 2, 0);
    const city = makeCity([building], [road]);
    const graph = buildRoadGraph(city);
    const reachability = analyzeConnectivity(city, graph);
    expect(reachability.get(makeBuildingId('b1'))).toBe(true);
  });

  it('marks buildings not adjacent to roads as disconnected', () => {
    const building = makeBuilding('b1', 0, 0);
    const road = makeRoad('r1', 10, 10);
    const city = makeCity([building], [road]);
    const graph = buildRoadGraph(city);
    const reachability = analyzeConnectivity(city, graph);
    expect(reachability.get(makeBuildingId('b1'))).toBe(false);
  });

  it('marks road-not-required buildings as connected regardless', () => {
    const building = makeBuilding('b1', 0, 0, false);
    const city = makeCity([building], []);
    const graph = buildRoadGraph(city);
    const reachability = analyzeConnectivity(city, graph);
    expect(reachability.get(makeBuildingId('b1'))).toBe(true);
  });
});

describe('detectDeadEnds', () => {
  it('detects road tiles with only one connection', () => {
    const roads = [makeRoad('r1', 0, 0), makeRoad('r2', 1, 0), makeRoad('r3', 2, 0)];
    const city = makeCity([], roads);
    const graph = buildRoadGraph(city);
    const deadEnds = detectDeadEnds(graph);
    expect(deadEnds.length).toBe(2);
  });

  it('returns empty array for connected loop (no dead ends)', () => {
    const roads = [
      makeRoad('r1', 0, 0), makeRoad('r2', 1, 0),
      makeRoad('r3', 0, 1), makeRoad('r4', 1, 1),
    ];
    const city = makeCity([], roads);
    const graph = buildRoadGraph(city);
    const deadEnds = detectDeadEnds(graph);
    expect(deadEnds.length).toBe(0);
  });
});

describe('findConnectedComponents', () => {
  it('finds separate road networks', () => {
    const roads = [makeRoad('r1', 0, 0), makeRoad('r2', 1, 0), makeRoad('r3', 10, 10), makeRoad('r4', 11, 10)];
    const city = makeCity([], roads);
    const graph = buildRoadGraph(city);
    const components = findConnectedComponents(graph);
    expect(components.length).toBe(2);
  });

  it('returns one component for connected network', () => {
    const roads = [makeRoad('r1', 0, 0), makeRoad('r2', 1, 0), makeRoad('r3', 2, 0)];
    const city = makeCity([], roads);
    const graph = buildRoadGraph(city);
    const components = findConnectedComponents(graph);
    expect(components.length).toBe(1);
  });
});
