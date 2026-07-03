import { describe, it, expect } from 'vitest';
import { mapCategory, isRoadCategory } from '../mappers/CategoryMapper.js';
import { BuildingCategory } from '@forgemind/core';

describe('mapCategory', () => {
  it('detects street/road entities', () => {
    expect(mapCategory('Street_EarlyMiddleAges')).toBe(BuildingCategory.Street);
    expect(mapCategory('LaneStreet')).toBe(BuildingCategory.Street);
  });

  it('detects main building', () => {
    expect(mapCategory('MainBuilding_BronzeAge')).toBe(BuildingCategory.MainBuilding);
  });

  it('detects great buildings', () => {
    expect(mapCategory('GreatBuilding_Arc')).toBe(BuildingCategory.GreatBuilding);
    expect(mapCategory('GreatBuilding_ArcBonus')).toBe(BuildingCategory.GreatBuilding);
  });

  it('detects residential', () => {
    expect(mapCategory('Residential_EarlyMiddleAges_1', 'residential')).toBe(BuildingCategory.Residential);
  });

  it('detects production', () => {
    expect(mapCategory('Production_EarlyMiddleAges_1', 'production')).toBe(BuildingCategory.Production);
  });

  it('detects goods', () => {
    expect(mapCategory('Goods_EarlyMiddleAges_Lumber', 'goods')).toBe(BuildingCategory.Goods);
  });

  it('detects military', () => {
    expect(mapCategory('Barracks_EarlyMiddleAges', 'military')).toBe(BuildingCategory.Military);
  });

  it('detects culture', () => {
    expect(mapCategory('Culture_EarlyMiddleAges_Garden', 'culture')).toBe(BuildingCategory.Culture);
  });

  it('detects decoration', () => {
    expect(mapCategory('Decoration_EarlyMiddleAges_Fountain', 'decoration')).toBe(BuildingCategory.Decoration);
  });

  it('returns Unknown for unknown entities', () => {
    expect(mapCategory('SomeUnknownEntity_XYZ')).toBe(BuildingCategory.Unknown);
  });
});

describe('isRoadCategory', () => {
  it('returns true for Street', () => {
    expect(isRoadCategory(BuildingCategory.Street)).toBe(true);
  });

  it('returns false for non-road categories', () => {
    expect(isRoadCategory(BuildingCategory.Residential)).toBe(false);
    expect(isRoadCategory(BuildingCategory.GreatBuilding)).toBe(false);
  });
});
