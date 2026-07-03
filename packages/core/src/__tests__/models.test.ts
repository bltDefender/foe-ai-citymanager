import { describe, it, expect } from 'vitest';
import { Era, BuildingCategory, BuildingState, RoadType, BonusType, WarningLevel } from '../index.js';
import { isBuilding, isRoad, isCity } from '../guards/index.js';
import { makeBuildingId, makeRoadId, makeCityId } from '../models/ids.js';

describe('Era', () => {
  it('has all FoE eras', () => {
    expect(Era.BronzeAge).toBe('BronzeAge');
    expect(Era.SpaceAgeVenus).toBe('SpaceAgeVenus');
    expect(Era.Unknown).toBe('Unknown');
  });
});

describe('BuildingCategory', () => {
  it('has all categories', () => {
    expect(BuildingCategory.MainBuilding).toBe('MainBuilding');
    expect(BuildingCategory.GreatBuilding).toBe('GreatBuilding');
    expect(BuildingCategory.Street).toBe('Street');
  });
});

describe('isBuilding guard', () => {
  it('returns true for valid building', () => {
    const building = {
      id: makeBuildingId('b1'),
      entityId: 'SomeBuilding',
      name: 'Town Hall',
      type: BuildingCategory.MainBuilding,
      category: BuildingCategory.MainBuilding,
      x: 0, y: 0, width: 4, height: 4,
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
    expect(isBuilding(building)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isBuilding(null)).toBe(false);
  });

  it('returns false for missing required fields', () => {
    expect(isBuilding({ id: 'b1' })).toBe(false);
  });
});

describe('isRoad guard', () => {
  it('returns true for valid road', () => {
    const road = {
      id: makeRoadId('r1'),
      x: 0, y: 0, width: 1, height: 1,
      roadType: RoadType.Paved,
      connected: true,
      era: Era.BronzeAge,
      metadata: {},
    };
    expect(isRoad(road)).toBe(true);
  });

  it('returns false for non-object', () => {
    expect(isRoad('road')).toBe(false);
  });
});

describe('isCity guard', () => {
  it('returns true for valid city', () => {
    const city = {
      id: makeCityId('city1'),
      width: 20, height: 20,
      era: Era.BronzeAge,
      owner: 'Player',
      buildings: [],
      roads: [],
      statistics: null,
      metadata: {},
      analysis: null,
    };
    expect(isCity(city)).toBe(true);
  });
});

describe('BonusType', () => {
  it('contains expected values', () => {
    expect(BonusType.Attack).toBe('Attack');
    expect(BonusType.RoadEfficiency).toBe('RoadEfficiency');
  });
});

describe('WarningLevel', () => {
  it('has Info, Warning, Error', () => {
    expect(WarningLevel.Info).toBe('Info');
    expect(WarningLevel.Warning).toBe('Warning');
    expect(WarningLevel.Error).toBe('Error');
  });
});
