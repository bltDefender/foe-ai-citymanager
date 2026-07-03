import { describe, it, expect } from 'vitest';
import { BuildingCategory, Era } from '@forgemind/core';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FoeHelperParser } from '../FoeHelperParser.js';
import { ParseError, ParseErrorCode } from '../errors/ParseError.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const currentJson = readFileSync(join(__dirname, 'fixtures/current-export.json'), 'utf-8');

function makeBaseExport() {
  return JSON.parse(currentJson) as {
    CityMapData: Record<string, Record<string, unknown>>;
    CityEntities: Record<string, Record<string, unknown>>;
    UnlockedAreas: Array<Record<string, unknown>>;
  };
}

describe('FoeHelperParser', () => {
  const parser = new FoeHelperParser();

  it('imports the current FoE Helper export successfully', () => {
    const city = parser.parse(currentJson);

    expect(city.width).toBe(32);
    expect(city.height).toBe(32);
    expect(city.era).toBe(Era.ModernEra);
    expect(city.buildings).toHaveLength(7);
    expect(city.roads).toHaveLength(3);
    expect(city.metadata.source).toBe('foe-helper-current');
    expect(city.metadata.availableMapSize).toEqual({ width: 32, height: 32 });
    expect(city.metadata.unlockedAreas).toHaveLength(4);
    expect(city.metadata.unlockedCoordinates).toHaveLength(1024);
    expect(city.metadata.expansionMap).toHaveLength(32);
    expect(city.metadata.parserWarnings).toEqual([]);
  });

  it('resolves static entity definitions into canonical buildings', () => {
    const city = parser.parse(currentJson);
    const arc = city.buildings.find((building) => building.entityId === 'GreatBuilding_ArcBonus');

    expect(arc).toBeDefined();
    expect(arc?.name).toBe('The Arc');
    expect(arc?.category).toBe(BuildingCategory.GreatBuilding);
    expect(arc?.width).toBe(5);
    expect(arc?.height).toBe(5);
    expect(arc?.roadRequired).toBe(true);
  });

  it('classifies unknown building types without aborting parsing', () => {
    const exportData = makeBaseExport();
    exportData.CityEntities['Mystery_Thing'] = {
      id: 'Mystery_Thing',
      name: 'Mystery Thing',
      type: 'off_grid',
      width: 2,
      length: 2,
    };
    exportData.CityMapData.mystery_1 = {
      id: 'mystery_1',
      cityentity_id: 'Mystery_Thing',
      x: 20,
      y: 2,
      type: 'off_grid',
    };

    const city = parser.parse(JSON.stringify(exportData));
    const mystery = city.buildings.find((building) => building.entityId === 'Mystery_Thing');

    expect(mystery?.category).toBe(BuildingCategory.Unknown);
    expect(city.metadata.parserWarnings).toContain('Unknown building type for Mystery_Thing');
  });

  it('throws MissingRootPropertyError when CityMapData is missing', () => {
    const exportData = makeBaseExport();
    delete (exportData as Partial<typeof exportData>).CityMapData;

    expect(() => parser.parse(JSON.stringify(exportData))).toThrow(expect.objectContaining({
      code: ParseErrorCode.MissingRootProperty,
    }));
  });

  it('throws MissingRootPropertyError when CityEntities is missing', () => {
    const exportData = makeBaseExport();
    delete (exportData as Partial<typeof exportData>).CityEntities;

    expect(() => parser.parse(JSON.stringify(exportData))).toThrow(expect.objectContaining({
      code: ParseErrorCode.MissingRootProperty,
    }));
  });

  it('throws MissingRootPropertyError when UnlockedAreas is missing', () => {
    const exportData = makeBaseExport();
    delete (exportData as Partial<typeof exportData>).UnlockedAreas;

    expect(() => parser.parse(JSON.stringify(exportData))).toThrow(expect.objectContaining({
      code: ParseErrorCode.MissingRootProperty,
    }));
  });

  it('throws ParseError for malformed JSON', () => {
    expect(() => parser.parse('not json')).toThrow(ParseError);
    expect(() => parser.parse('not json')).toThrow(expect.objectContaining({ code: ParseErrorCode.InvalidJson }));
  });

  it('throws DuplicateIdError for duplicate instance ids', () => {
    const exportData = makeBaseExport();
    exportData.CityMapData.duplicate_1 = {
      id: 'dup_1',
      cityentity_id: 'Residential_ModernEra_Townhouse',
      x: 2,
      y: 6,
      type: 'residential',
    };
    exportData.CityMapData.duplicate_2 = {
      id: 'dup_1',
      cityentity_id: 'Residential_ModernEra_Apartment',
      x: 4,
      y: 6,
      type: 'residential',
    };

    expect(() => parser.parse(JSON.stringify(exportData))).toThrow(expect.objectContaining({
      code: ParseErrorCode.DuplicateId,
    }));
  });

  it('throws UnknownEntityError when an entity definition is missing', () => {
    const exportData = makeBaseExport();
    exportData.CityMapData.unknown_1 = {
      id: 'unknown_1',
      cityentity_id: 'Missing_Definition',
      x: 1,
      y: 1,
    };

    expect(() => parser.parse(JSON.stringify(exportData))).toThrow(expect.objectContaining({
      code: ParseErrorCode.UnknownEntity,
    }));
  });

  it('parses an empty city', () => {
    const city = parser.parse(JSON.stringify({
      CityMapData: {},
      CityEntities: {},
      UnlockedAreas: [],
    }));

    expect(city.width).toBe(0);
    expect(city.height).toBe(0);
    expect(city.buildings).toHaveLength(0);
    expect(city.roads).toHaveLength(0);
    expect(city.statistics?.tileCount).toBe(0);
  });
});
