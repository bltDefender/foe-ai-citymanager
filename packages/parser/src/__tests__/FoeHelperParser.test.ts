import { describe, it, expect } from 'vitest';
import { FoeHelperParser } from '../FoeHelperParser.js';
import { ParseError, ParseErrorCode } from '../errors/ParseError.js';
import { BuildingCategory, Era, BuildingState } from '@forgemind/core';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const v1Json = readFileSync(join(__dirname, 'fixtures/v1-export.json'), 'utf-8');
const v2Json = readFileSync(join(__dirname, 'fixtures/v2-export.json'), 'utf-8');

describe('FoeHelperParser - V1', () => {
  const parser = new FoeHelperParser();

  it('parses v1 export successfully', () => {
    const city = parser.parse(v1Json);
    expect(city).toBeDefined();
    expect(city.width).toBe(20);
    expect(city.height).toBe(18);
    expect(city.owner).toBe('TestPlayer');
    expect(city.era).toBe(Era.EarlyMiddleAges);
  });

  it('separates buildings and roads', () => {
    const city = parser.parse(v1Json);
    expect(city.buildings.length).toBeGreaterThan(0);
    expect(city.roads.length).toBeGreaterThan(0);
  });

  it('correctly identifies main building', () => {
    const city = parser.parse(v1Json);
    const main = city.buildings.find(b => b.id === 'main_1');
    expect(main).toBeDefined();
    expect(main?.category).toBe(BuildingCategory.MainBuilding);
  });

  it('correctly identifies great building', () => {
    const city = parser.parse(v1Json);
    const gb = city.buildings.find(b => b.id === 'gb_1');
    expect(gb).toBeDefined();
    expect(gb?.category).toBe(BuildingCategory.GreatBuilding);
  });

  it('correctly identifies residential buildings', () => {
    const city = parser.parse(v1Json);
    const res = city.buildings.filter(b => b.category === BuildingCategory.Residential);
    expect(res.length).toBeGreaterThan(0);
  });

  it('calculates statistics', () => {
    const city = parser.parse(v1Json);
    expect(city.statistics).toBeDefined();
    expect(city.statistics?.buildingCount).toBeGreaterThan(0);
    expect(city.statistics?.roadTiles).toBeGreaterThan(0);
  });

  it('sets building states correctly', () => {
    const city = parser.parse(v1Json);
    const res = city.buildings.find(b => b.id === 'res_1');
    expect(res?.state).toBe(BuildingState.Collecting);
  });
});

describe('FoeHelperParser - V2', () => {
  const parser = new FoeHelperParser();

  it('parses v2 export successfully', () => {
    const city = parser.parse(v2Json);
    expect(city).toBeDefined();
    expect(city.width).toBe(25);
    expect(city.height).toBe(22);
    expect(city.owner).toBe('AdvancedPlayer');
    expect(city.era).toBe(Era.ModernEra);
  });

  it('includes roads from dedicated roads array', () => {
    const city = parser.parse(v2Json);
    expect(city.roads.length).toBeGreaterThan(0);
  });

  it('identifies great buildings in v2', () => {
    const city = parser.parse(v2Json);
    const arc = city.buildings.find(b => b.id === 'gb_arc');
    expect(arc).toBeDefined();
    expect(arc?.category).toBe(BuildingCategory.GreatBuilding);
    expect(arc?.level).toBe(80);
  });

  it('sets metadata correctly', () => {
    const city = parser.parse(v2Json);
    expect(city.metadata.foeHelperVersion).toBe('1.234.0');
    expect(city.metadata.playerName).toBe('AdvancedPlayer');
  });

  it('statistics are correct', () => {
    const city = parser.parse(v2Json);
    expect(city.statistics?.greatBuildingCount).toBe(2);
  });
});

describe('FoeHelperParser - Error Handling', () => {
  const parser = new FoeHelperParser();

  it('throws ParseError for invalid JSON', () => {
    expect(() => parser.parse('not json')).toThrow(ParseError);
    expect(() => parser.parse('not json')).toThrow(expect.objectContaining({ code: ParseErrorCode.InvalidJson }));
  });

  it('throws ParseError for unknown version', () => {
    expect(() => parser.parse('{"version": 99}')).toThrow(ParseError);
  });

  it('throws ParseError for invalid schema', () => {
    expect(() => parser.parse('{"version": 1}')).toThrow(ParseError);
  });
});
