import { BuildingCategory, makeCityId } from '@forgemind/core';
import type { Building, City, Road, Statistics } from '@forgemind/core';
import type { IParser } from './IParser.js';
import { ParseError, ParseErrorCode } from './errors/ParseError.js';
import { FoeHelperV1Schema, FoeHelperV2Schema } from './schema/FoeHelperSchema.js';
import { mapEntityToBuilding, mapEntityToRoad, isRoadEntity } from './mappers/BuildingMapper.js';
import { mapEra } from './mappers/EraMapper.js';
import crypto from 'node:crypto';

export class FoeHelperParser implements IParser<string> {
  parse(jsonString: string): City {
    let data: unknown;
    try {
      data = JSON.parse(jsonString);
    } catch {
      throw new ParseError(ParseErrorCode.InvalidJson, 'Invalid JSON input');
    }

    if (typeof data !== 'object' || data === null) {
      throw new ParseError(ParseErrorCode.InvalidSchema, 'Root must be an object');
    }

    const version = this.detectVersion(data);
    if (version === 1) {
      return this.parseV1(data);
    }
    return this.parseV2(data);
  }

  private detectVersion(data: object): 1 | 2 {
    const obj = data as Record<string, unknown>;
    const v = obj['version'];
    if (v === 1) return 1;
    if (v === 2) return 2;
    if ('entities' in obj && 'width' in obj && 'height' in obj) return 1;
    if ('city' in obj && typeof obj['city'] === 'object') return 2;
    throw new ParseError(ParseErrorCode.UnknownVersion, `Unknown version: ${String(v)}`);
  }

  private parseV1(data: unknown): City {
    const result = FoeHelperV1Schema.safeParse(data);
    if (!result.success) {
      throw new ParseError(
        ParseErrorCode.InvalidSchema,
        `V1 schema validation failed: ${result.error.message}`,
        { issues: result.error.issues },
      );
    }
    const d = result.data;
    const buildings: Building[] = [];
    const roads: Road[] = [];

    for (const entity of d.entities) {
      if (isRoadEntity(entity)) {
        roads.push(mapEntityToRoad(entity, 1));
      } else {
        buildings.push(mapEntityToBuilding(entity, 1));
      }
    }

    const statistics = this.buildStatistics(buildings, roads, d.width, d.height);
    const exportDate = d.exportDate ? new Date(d.exportDate) : new Date();
    const checksum = this.computeChecksum(JSON.stringify(data));

    return {
      id: makeCityId(`v1-${d.playerName ?? 'unknown'}-${Date.now()}`),
      width: d.width,
      height: d.height,
      era: mapEra(d.era),
      owner: d.playerName ?? 'Unknown',
      buildings,
      roads,
      statistics,
      metadata: {
        gameVersion: '1',
        exportDate,
        foeHelperVersion: '1.0',
        playerName: d.playerName ?? 'Unknown',
        era: mapEra(d.era),
        source: 'foe-helper-v1',
        checksum,
      },
      analysis: null,
    };
  }

  private parseV2(data: unknown): City {
    const result = FoeHelperV2Schema.safeParse(data);
    if (!result.success) {
      throw new ParseError(
        ParseErrorCode.InvalidSchema,
        `V2 schema validation failed: ${result.error.message}`,
        { issues: result.error.issues },
      );
    }
    const d = result.data;
    const buildings: Building[] = [];
    const roads: Road[] = [];

    for (const entity of d.city.entities) {
      if (isRoadEntity(entity)) {
        roads.push(mapEntityToRoad(entity, 2));
      } else {
        buildings.push(mapEntityToBuilding(entity, 2));
      }
    }

    if (d.city.roads) {
      for (const roadEntity of d.city.roads) {
        roads.push(mapEntityToRoad(roadEntity, 2));
      }
    }

    const statistics = this.buildStatistics(buildings, roads, d.city.width, d.city.height);
    const exportDate = d.exportDate ? new Date(d.exportDate) : new Date();
    const playerName = d.player?.name ?? 'Unknown';
    const era = mapEra(d.player?.era);
    const checksum = this.computeChecksum(JSON.stringify(data));

    return {
      id: makeCityId(`v2-${playerName}-${Date.now()}`),
      width: d.city.width,
      height: d.city.height,
      era,
      owner: playerName,
      buildings,
      roads,
      statistics,
      metadata: {
        gameVersion: '2',
        exportDate,
        foeHelperVersion: d.foeHelperVersion ?? 'Unknown',
        playerName,
        era,
        source: 'foe-helper-v2',
        checksum,
      },
      analysis: null,
    };
  }

  private buildStatistics(buildings: Building[], roads: Road[], width: number, height: number): Statistics {
    const tileCount = width * height;
    let roadTiles = 0;
    for (const road of roads) {
      roadTiles += road.width * road.height;
    }

    let buildingTiles = 0;
    let decorationTiles = 0;
    let cultureTiles = 0;
    let militaryTiles = 0;
    let productionTiles = 0;
    let goodsTiles = 0;
    let residentialTiles = 0;
    let greatBuildingCount = 0;

    for (const building of buildings) {
      const tiles = building.width * building.height;
      buildingTiles += tiles;
      if (building.category === BuildingCategory.GreatBuilding) greatBuildingCount++;
      if (building.category === BuildingCategory.Decoration) decorationTiles += tiles;
      else if (building.category === BuildingCategory.Culture) cultureTiles += tiles;
      else if (building.category === BuildingCategory.Military) militaryTiles += tiles;
      else if (building.category === BuildingCategory.Production) productionTiles += tiles;
      else if (building.category === BuildingCategory.Goods) goodsTiles += tiles;
      else if (building.category === BuildingCategory.Residential) residentialTiles += tiles;
    }

    const occupiedTiles = buildingTiles + roadTiles;
    const unusedTiles = Math.max(0, tileCount - occupiedTiles);
    const roadPercentage = tileCount > 0 ? (roadTiles / tileCount) * 100 : 0;
    const unusedPercentage = tileCount > 0 ? (unusedTiles / tileCount) * 100 : 0;
    const occupiedPercentage = tileCount > 0 ? (occupiedTiles / tileCount) * 100 : 0;
    const efficiency = occupiedTiles > 0 ? buildingTiles / occupiedTiles : 0;

    return {
      tileCount,
      occupiedTiles,
      roadTiles,
      unusedTiles,
      buildingTiles,
      decorationTiles,
      cultureTiles,
      militaryTiles,
      productionTiles,
      goodsTiles,
      residentialTiles,
      roadPercentage,
      unusedPercentage,
      occupiedPercentage,
      efficiency,
      buildingCount: buildings.length,
      greatBuildingCount,
    };
  }

  private computeChecksum(data: string): string {
    return crypto.createHash('md5').update(data).digest('hex');
  }
}
