import { describe, expect, it } from 'vitest';
import { BuildingCategory, BuildingState, Era, RoadType, makeBuildingId, makeRoadId } from '@forgemind/core';
import type { Building, Road } from '@forgemind/core';
import { CategoryColors, DEFAULT_COLOR_SCHEME, getColorForBuilding, getColorForRoad } from '../colors/index.js';

function makeBuilding(category: BuildingCategory): Building {
  return {
    id: makeBuildingId('b1'),
    entityId: 'test',
    name: 'Test Building',
    type: category,
    category,
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
}

function makeRoad(): Road {
  return {
    id: makeRoadId('r1'),
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    roadType: RoadType.Paved,
    connected: true,
    era: Era.BronzeAge,
    metadata: {},
  };
}

describe('CategoryColors', () => {
  it('has colors for all categories', () => {
    for (const category of Object.values(BuildingCategory)) {
      expect(CategoryColors[category]).toBeDefined();
      expect(CategoryColors[category].fill).toMatch(/^#/);
      expect(CategoryColors[category].stroke).toMatch(/^#/);
    }
  });
});

describe('getColorForBuilding', () => {
  it('returns color for each building category', () => {
    for (const category of Object.values(BuildingCategory)) {
      const building = makeBuilding(category);
      const color = getColorForBuilding(building);
      expect(color).toBeDefined();
      expect(color.fill).toBeTruthy();
    }
  });
});

describe('getColorForRoad', () => {
  it('returns street color for roads', () => {
    const road = makeRoad();
    const color = getColorForRoad(road);
    expect(color).toBe(CategoryColors[BuildingCategory.Street]);
  });
});

describe('DEFAULT_COLOR_SCHEME', () => {
  it('contains all building categories', () => {
    for (const category of Object.values(BuildingCategory)) {
      expect(DEFAULT_COLOR_SCHEME[category]).toBeDefined();
    }
  });
});
