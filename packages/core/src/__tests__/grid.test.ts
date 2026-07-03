import { describe, it, expect } from 'vitest';
import {
  getTileAt, getBuildingAt, getRoadAt,
  getAdjacentTiles, isTileOccupied, tilesOverlap, isWithinBounds,
} from '../utils/grid.js';
import type { City } from '../models/City.js';
import type { Building } from '../models/Building.js';
import type { Road } from '../models/Road.js';
import { Era } from '../models/Era.js';
import { BuildingCategory } from '../models/BuildingCategory.js';
import { BuildingState } from '../models/BuildingState.js';
import { RoadType } from '../models/RoadType.js';
import { makeBuildingId, makeRoadId, makeCityId } from '../models/ids.js';

function makeTestBuilding(id: string, x: number, y: number, w = 2, h = 2): Building {
  return {
    id: makeBuildingId(id),
    entityId: id,
    name: id,
    type: BuildingCategory.Residential,
    category: BuildingCategory.Residential,
    x, y, width: w, height: h,
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
}

function makeTestRoad(id: string, x: number, y: number): Road {
  return {
    id: makeRoadId(id),
    x, y, width: 1, height: 1,
    roadType: RoadType.Paved,
    connected: true,
    era: Era.BronzeAge,
    metadata: {},
  };
}

function makeTestCity(buildings: Building[], roads: Road[]): City {
  return {
    id: makeCityId('city1'),
    width: 20, height: 20,
    era: Era.BronzeAge,
    owner: 'TestPlayer',
    buildings,
    roads,
    statistics: null,
    metadata: {
      gameVersion: '1.0',
      exportDate: new Date(),
      foeHelperVersion: '1.0',
      playerName: 'TestPlayer',
      era: Era.BronzeAge,
      source: 'test',
      checksum: '',
    },
    analysis: null,
  };
}

describe('getBuildingAt', () => {
  it('returns building when tile is within its bounds', () => {
    const b = makeTestBuilding('b1', 2, 3, 2, 2);
    const city = makeTestCity([b], []);
    expect(getBuildingAt(city, 2, 3)).toBe(b);
    expect(getBuildingAt(city, 3, 4)).toBe(b);
  });

  it('returns null when no building at tile', () => {
    const city = makeTestCity([], []);
    expect(getBuildingAt(city, 0, 0)).toBeNull();
  });

  it('does not return building outside its bounds', () => {
    const b = makeTestBuilding('b1', 2, 3, 2, 2);
    const city = makeTestCity([b], []);
    expect(getBuildingAt(city, 4, 3)).toBeNull();
    expect(getBuildingAt(city, 2, 5)).toBeNull();
  });
});

describe('getRoadAt', () => {
  it('returns road at correct position', () => {
    const r = makeTestRoad('r1', 5, 5);
    const city = makeTestCity([], [r]);
    expect(getRoadAt(city, 5, 5)).toBe(r);
  });

  it('returns null when no road', () => {
    const city = makeTestCity([], []);
    expect(getRoadAt(city, 0, 0)).toBeNull();
  });
});

describe('getTileAt', () => {
  it('returns building before road', () => {
    const b = makeTestBuilding('b1', 0, 0);
    const r = makeTestRoad('r1', 5, 5);
    const city = makeTestCity([b], [r]);
    expect(getTileAt(city, 0, 0)).toBe(b);
    expect(getTileAt(city, 5, 5)).toBe(r);
  });

  it('returns null for empty tile', () => {
    const city = makeTestCity([], []);
    expect(getTileAt(city, 10, 10)).toBeNull();
  });
});

describe('getAdjacentTiles', () => {
  it('returns 4 adjacent tiles', () => {
    const adjacent = getAdjacentTiles(5, 5);
    expect(adjacent).toHaveLength(4);
    expect(adjacent).toContainEqual({ x: 4, y: 5 });
    expect(adjacent).toContainEqual({ x: 6, y: 5 });
    expect(adjacent).toContainEqual({ x: 5, y: 4 });
    expect(adjacent).toContainEqual({ x: 5, y: 6 });
  });
});

describe('isTileOccupied', () => {
  it('returns true for occupied tile', () => {
    const b = makeTestBuilding('b1', 3, 3);
    const city = makeTestCity([b], []);
    expect(isTileOccupied(city, 3, 3)).toBe(true);
  });

  it('returns false for empty tile', () => {
    const city = makeTestCity([], []);
    expect(isTileOccupied(city, 10, 10)).toBe(false);
  });
});

describe('tilesOverlap', () => {
  it('detects overlap', () => {
    expect(tilesOverlap(
      { x: 0, y: 0, width: 3, height: 3 },
      { x: 2, y: 2, width: 3, height: 3 },
    )).toBe(true);
  });

  it('detects no overlap', () => {
    expect(tilesOverlap(
      { x: 0, y: 0, width: 2, height: 2 },
      { x: 3, y: 3, width: 2, height: 2 },
    )).toBe(false);
  });

  it('detects touching tiles as non-overlapping', () => {
    expect(tilesOverlap(
      { x: 0, y: 0, width: 2, height: 2 },
      { x: 2, y: 0, width: 2, height: 2 },
    )).toBe(false);
  });
});

describe('isWithinBounds', () => {
  it('returns true for tiles within city bounds', () => {
    const city = makeTestCity([], []);
    expect(isWithinBounds(city, 0, 0)).toBe(true);
    expect(isWithinBounds(city, 19, 19)).toBe(true);
    expect(isWithinBounds(city, 10, 10, 5, 5)).toBe(true);
  });

  it('returns false for tiles outside city bounds', () => {
    const city = makeTestCity([], []);
    expect(isWithinBounds(city, 20, 0)).toBe(false);
    expect(isWithinBounds(city, 0, 20)).toBe(false);
    expect(isWithinBounds(city, -1, 0)).toBe(false);
  });
});
