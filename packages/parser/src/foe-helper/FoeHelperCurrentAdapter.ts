import {
  BuildingCategory,
  Era,
  makeCityId,
} from '@forgemind/core';
import type {
  Building,
  City,
  Coordinate,
  MapSize,
  Road,
  Statistics,
  UnlockedAreaMetadata,
} from '@forgemind/core';
import { ParseError, ParseErrorCode } from '../errors/ParseError.js';
import { mapEntityToBuilding, mapEntityToRoad, isRoadEntity } from '../mappers/BuildingMapper.js';
import { mapCategory } from '../mappers/CategoryMapper.js';
import { mapEra } from '../mappers/EraMapper.js';
import {
  FoeHelperCurrentExportSchema,
  type FoeHelperCurrentExport,
  type FoeHelperEntity,
  type FoeHelperEntityDefinition,
  type FoeHelperUnlockedArea,
} from '../schema/FoeHelperSchema.js';

interface ExpansionData {
  readonly availableMapSize: MapSize;
  readonly unlockedAreas: readonly UnlockedAreaMetadata[];
  readonly unlockedCoordinates: readonly Coordinate[];
  readonly expansionMap: readonly (readonly boolean[])[];
}

export class FoeHelperCurrentAdapter {
  parse(data: unknown): City {
    const result = FoeHelperCurrentExportSchema.safeParse(data);
    if (!result.success) {
      throw new ParseError(
        ParseErrorCode.InvalidSchema,
        `FoE Helper schema validation failed: ${result.error.message}`,
        { issues: result.error.issues },
      );
    }

    return this.toCanonicalCity(result.data, data);
  }

  private toCanonicalCity(data: FoeHelperCurrentExport, rawData: unknown): City {
    const warnings: string[] = [];
    const buildings: Building[] = [];
    const roads: Road[] = [];
    const seenIds = new Set<string>();

    for (const instance of Object.values(data.CityMapData)) {
      const resolvedEntity = this.tryResolveEntity(instance, data.CityEntities, seenIds, warnings);
      if (!resolvedEntity) {
        continue;
      }
      if (isRoadEntity(resolvedEntity)) {
        roads.push(mapEntityToRoad(resolvedEntity));
      } else {
        buildings.push(mapEntityToBuilding(resolvedEntity));
      }
    }

    const expansionData = this.normalizeUnlockedAreas(data.UnlockedAreas, warnings);
    const fallbackMapSize = this.getOccupiedMapSize([...buildings, ...roads]);
    const width = expansionData.availableMapSize.width || fallbackMapSize.width;
    const height = expansionData.availableMapSize.height || fallbackMapSize.height;
    const era = this.resolveCityEra(buildings);
    const exportDate = new Date();
    const checksum = this.computeChecksum(JSON.stringify(rawData));

    return {
      id: makeCityId(`foe-helper-current-${checksum}`),
      width,
      height,
      era,
      owner: 'Unknown',
      buildings,
      roads,
      statistics: this.buildStatistics(buildings, roads, width, height),
      metadata: {
        gameVersion: 'current',
        exportDate,
        foeHelperVersion: 'Unknown',
        playerName: 'Unknown',
        era,
        source: 'foe-helper-current',
        checksum,
        parserWarnings: warnings,
        availableMapSize: { width, height },
        unlockedAreas: expansionData.unlockedAreas,
        unlockedCoordinates: expansionData.unlockedCoordinates,
        expansionMap: expansionData.expansionMap,
      },
      analysis: null,
    };
  }

  private resolveEntity(
    instance: FoeHelperEntity,
    definitions: Record<string, FoeHelperEntityDefinition>,
    seenIds: Set<string>,
    warnings: string[],
  ): FoeHelperEntity {
    const instanceId = instance.id;
    if (seenIds.has(instanceId)) {
      throw new ParseError(ParseErrorCode.DuplicateId, `Duplicate entity id: ${instanceId}`, { id: instanceId });
    }
    seenIds.add(instanceId);

    const definition = definitions[instance.cityentity_id];
    if (!definition) {
      throw new ParseError(
        ParseErrorCode.UnknownEntity,
        `Missing entity definition for ${instance.cityentity_id}`,
        { cityentityId: instance.cityentity_id, instanceId },
      );
    }

    const x = this.readNonNegativeInteger(instance.x, 'x', instanceId);
    const y = this.readNonNegativeInteger(instance.y, 'y', instanceId);
    const width = this.resolveDimension(
      [instance.width, definition.width, definition.components?.AllAge?.placement?.size?.x],
      'width',
      instanceId,
    );
    const height = this.resolveDimension(
      [instance.height, instance.length, definition.length, definition.components?.AllAge?.placement?.size?.y],
      'height',
      instanceId,
    );
    const type = instance.type ?? definition.type;
    const category = mapCategory(instance.cityentity_id, type);
    const roadRequirement = this.resolveRoadRequirement(definition, instanceId, category);
    const connected = this.readBoolean(instance.connected, roadRequirement === 0);
    const roadRequired = roadRequirement > 0;

    if (category === BuildingCategory.Unknown) {
      warnings.push(`Unknown building type for ${instance.cityentity_id}`);
    }

    return {
      ...instance,
      x,
      y,
      width,
      height,
      connected: connected ? 1 : 0,
      needs_road: roadRequired ? 1 : 0,
      type,
      name: definition.name ?? instance.name ?? instance.cityentity_id,
      level: this.readOptionalInteger(instance.level) ?? 1,
      era: instance.era ?? this.extractEra(instance.cityentity_id),
    };
  }

  private tryResolveEntity(
    instance: FoeHelperEntity,
    definitions: Record<string, FoeHelperEntityDefinition>,
    seenIds: Set<string>,
    warnings: string[],
  ): FoeHelperEntity | null {
    try {
      return this.resolveEntity(instance, definitions, seenIds, warnings);
    } catch (error) {
      if (error instanceof ParseError && error.code === ParseErrorCode.InvalidCoordinates) {
        warnings.push(`Skipped entity ${String(instance.id)} due to invalid coordinates`);
        return null;
      }
      throw error;
    }
  }

  private normalizeUnlockedAreas(unlockedAreas: readonly FoeHelperUnlockedArea[], warnings: string[]): ExpansionData {
    const normalizedAreas = unlockedAreas.flatMap((area, index) => {
      const id = `UnlockedAreas[${index}]`;
      try {
        return [{
          x: this.readNonNegativeInteger(area.x, 'x', id),
          y: this.readNonNegativeInteger(area.y, 'y', id),
          width: this.resolveDimension([area.width], 'width', id, 16),
          height: this.resolveDimension([area.height, area.length], 'height', id, 16),
        }];
      } catch (error) {
        if (error instanceof ParseError && error.code === ParseErrorCode.InvalidCoordinates) {
          warnings.push(`Skipped unlocked area at index ${index} due to invalid coordinates`);
          return [];
        }
        throw error;
      }
    });

    const width = normalizedAreas.reduce((max, area) => Math.max(max, area.x + area.width), 0);
    const height = normalizedAreas.reduce((max, area) => Math.max(max, area.y + area.height), 0);
    const expansionMap = Array.from({ length: height }, () => Array.from({ length: width }, () => false));
    const unlockedCoordinates: Coordinate[] = [];

    for (const area of normalizedAreas) {
      for (let y = area.y; y < area.y + area.height; y++) {
        for (let x = area.x; x < area.x + area.width; x++) {
          if (!expansionMap[y][x]) {
            expansionMap[y][x] = true;
            unlockedCoordinates.push({ x, y });
          }
        }
      }
    }

    return {
      availableMapSize: { width, height },
      unlockedAreas: normalizedAreas,
      unlockedCoordinates,
      expansionMap,
    };
  }

  private resolveRoadRequirement(
    definition: FoeHelperEntityDefinition,
    context: string,
    category: BuildingCategory,
  ): number {
    const roadRequirement = this.readOptionalInteger(
      definition.components?.AllAge?.streetConnectionRequirement?.requiredLevel
      ?? definition.components?.streetConnectionRequirement?.requiredLevel
      ?? definition.requirements?.street_connection_level,
    );

    if (roadRequirement === undefined) {
      return this.requiresRoadByCategory(category) ? 1 : 0;
    }
    if (roadRequirement < 0) {
      throw new ParseError(ParseErrorCode.InvalidValue, `Invalid road requirement for ${context}`, { context, roadRequirement });
    }
    return roadRequirement;
  }

  private resolveDimension(
    candidates: readonly unknown[],
    field: 'width' | 'height',
    context: string,
    fallback = 1,
  ): number {
    for (const candidate of candidates) {
      const parsed = this.readOptionalInteger(candidate);
      if (parsed !== undefined) {
        if (parsed <= 0) {
          throw new ParseError(ParseErrorCode.InvalidValue, `Invalid ${field} for ${context}`, { context, field, value: candidate });
        }
        return parsed;
      }
    }
    return fallback;
  }

  private readNonNegativeInteger(value: unknown, field: 'x' | 'y', context: string): number {
    const parsed = this.readOptionalInteger(value);
    if (parsed === undefined || parsed < 0) {
      throw new ParseError(ParseErrorCode.InvalidCoordinates, `Invalid ${field} coordinate for ${context}`, {
        context,
        field,
        value,
      });
    }
    return parsed;
  }

  private readBoolean(value: unknown, fallback: boolean): boolean {
    if (value === undefined) {
      return fallback;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === '1' || normalized === 'true') return true;
      if (normalized === '0' || normalized === 'false') return false;
    }
    return fallback;
  }

  private readOptionalInteger(value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? Math.trunc(value) : undefined;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? Math.trunc(parsed) : undefined;
    }
    return undefined;
  }

  private resolveCityEra(buildings: readonly Building[]): Era {
    const mainBuilding = buildings.find((building) => building.category === BuildingCategory.MainBuilding);
    if (mainBuilding) {
      return mainBuilding.era;
    }
    return buildings[0]?.era ?? Era.Unknown;
  }

  private extractEra(entityId: string): string | undefined {
    const parts = entityId.split(/[_-]/);
    return parts.find((part) => mapEra(part) !== Era.Unknown);
  }

  private requiresRoadByCategory(category: BuildingCategory): boolean {
    switch (category) {
      case BuildingCategory.MainBuilding:
      case BuildingCategory.GreatBuilding:
      case BuildingCategory.Residential:
      case BuildingCategory.Production:
      case BuildingCategory.Goods:
      case BuildingCategory.Military:
        return true;
      default:
        return false;
    }
  }

  private getOccupiedMapSize(items: readonly Pick<Building | Road, 'x' | 'y' | 'width' | 'height'>[]): MapSize {
    return items.reduce(
      (size, item) => ({
        width: Math.max(size.width, item.x + item.width),
        height: Math.max(size.height, item.y + item.height),
      }),
      { width: 0, height: 0 },
    );
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
    let hash = 5381;
    for (let index = 0; index < data.length; index++) {
      hash = ((hash << 5) + hash) ^ data.charCodeAt(index);
    }
    return (hash >>> 0).toString(16);
  }
}
