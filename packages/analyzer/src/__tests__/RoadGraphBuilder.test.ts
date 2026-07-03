import { describe, it, expect } from 'vitest';
import { buildRoadGraph } from '../graph/RoadGraphBuilder.js';
import type { City, Road } from '@forgemind/core';
import { Era, RoadType, makeRoadId, makeCityId } from '@forgemind/core';

function makeCity(roads: Road[]): City {
  return {
    id: makeCityId('test'),
    width: 20, height: 20, era: Era.BronzeAge, owner: 'test',
    buildings: [], roads, statistics: null,
    metadata: { gameVersion: '1', exportDate: new Date(), foeHelperVersion: '1', playerName: 'test', era: Era.BronzeAge, source: 'test', checksum: '' },
    analysis: null,
  };
}

function makeRoad(id: string, x: number, y: number, w = 1, h = 1): Road {
  return { id: makeRoadId(id), x, y, width: w, height: h, roadType: RoadType.Paved, connected: true, era: Era.BronzeAge, metadata: {} };
}

describe('buildRoadGraph', () => {
  it('creates nodes for each road tile', () => {
    const city = makeCity([makeRoad('r1', 0, 0), makeRoad('r2', 1, 0)]);
    const graph = buildRoadGraph(city);
    expect(graph.nodes.size).toBe(2);
    expect(graph.nodes.has('0,0')).toBe(true);
    expect(graph.nodes.has('1,0')).toBe(true);
  });

  it('connects adjacent road tiles', () => {
    const city = makeCity([makeRoad('r1', 0, 0), makeRoad('r2', 1, 0), makeRoad('r3', 2, 0)]);
    const graph = buildRoadGraph(city);
    const node0 = graph.nodes.get('0,0')!;
    expect(node0.connections).toContain('1,0');
    const node1 = graph.nodes.get('1,0')!;
    expect(node1.connections).toContain('0,0');
    expect(node1.connections).toContain('2,0');
  });

  it('does not connect non-adjacent roads', () => {
    const city = makeCity([makeRoad('r1', 0, 0), makeRoad('r2', 5, 0)]);
    const graph = buildRoadGraph(city);
    const node0 = graph.nodes.get('0,0')!;
    expect(node0.connections).not.toContain('5,0');
  });

  it('handles multi-tile roads', () => {
    const city = makeCity([makeRoad('r1', 0, 0, 3, 1)]);
    const graph = buildRoadGraph(city);
    expect(graph.nodes.size).toBe(3);
  });

  it('returns empty graph for city with no roads', () => {
    const city = makeCity([]);
    const graph = buildRoadGraph(city);
    expect(graph.nodes.size).toBe(0);
    expect(graph.edges.length).toBe(0);
  });
});
