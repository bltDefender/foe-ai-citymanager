import {
  Building, Road, BuildingCategory, BuildingState, RoadType,
  makeBuildingId, makeRoadId,
} from '@forgemind/core';
import type { FoeHelperEntity } from '../schema/FoeHelperSchema.js';
import { mapCategory } from './CategoryMapper.js';
import { mapEra } from './EraMapper.js';

export function isRoadEntity(entity: FoeHelperEntity): boolean {
  const category = mapCategory(entity.cityentity_id, entity.type);
  return category === BuildingCategory.Street;
}

function toNumber(value: string | number | undefined, fallback: number): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toFlag(value: string | number | boolean | undefined, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === '1' || normalized === 'true') return true;
    if (normalized === '0' || normalized === 'false') return false;
  }
  return fallback;
}

function mapBuildingState(state?: unknown): BuildingState {
  if (!state || typeof state !== 'string') return BuildingState.Unknown;
  const s = state.toLowerCase();
  if (s === 'idle' || s === 'not_motivated') return BuildingState.Idle;
  if (s === 'collecting' || s === 'collection_available') return BuildingState.Collecting;
  if (s === 'producing' || s === 'in_production') return BuildingState.Producing;
  if (s === 'under_construction' || s === 'construction') return BuildingState.UnderConstruction;
  if (s === 'motivated') return BuildingState.Motivated;
  if (s === 'polished') return BuildingState.Polished;
  return BuildingState.Unknown;
}

function mapRoadType(entityId: string): RoadType {
  const id = entityId.toLowerCase();
  if (id.includes('dirt') || id.includes('path')) return RoadType.Dirt;
  if (id.includes('gravel')) return RoadType.Gravel;
  if (id.includes('paved') || id.includes('stone')) return RoadType.Paved;
  if (id.includes('cobblestone') || id.includes('cobble')) return RoadType.Cobblestone;
  if (id.includes('high_street') || id.includes('highstreet')) return RoadType.HighStreet;
  if (id.includes('fiber') || id.includes('light')) return RoadType.Fiber;
  if (id.includes('lane')) return RoadType.Lane;
  return RoadType.Unknown;
}

export function mapEntityToBuilding(entity: FoeHelperEntity): Building {
  const category = mapCategory(entity.cityentity_id, entity.type);
  const era = mapEra(entity.era);

  return {
    id: makeBuildingId(entity.id),
    entityId: entity.cityentity_id,
    name: entity.name ?? entity.cityentity_id,
    type: category,
    category,
    x: toNumber(entity.x, 0),
    y: toNumber(entity.y, 0),
    width: toNumber(entity.width, 1),
    height: toNumber(entity.height, 1),
    rotation: 0,
    connected: toFlag(entity.connected, false),
    roadRequired: toFlag(entity.needs_road, true),
    era,
    level: toNumber(entity.level, 1),
    state: mapBuildingState(entity.state),
    productions: [],
    bonuses: [],
    tags: [],
    metadata: {
      rawType: entity.type,
      rawEntityId: entity.cityentity_id,
    },
  };
}

export function mapEntityToRoad(entity: FoeHelperEntity): Road {
  return {
    id: makeRoadId(entity.id),
    x: toNumber(entity.x, 0),
    y: toNumber(entity.y, 0),
    width: toNumber(entity.width, 1),
    height: toNumber(entity.height, 1),
    roadType: mapRoadType(entity.cityentity_id),
    connected: true,
    era: mapEra(entity.era),
    metadata: {
      rawEntityId: entity.cityentity_id,
    },
  };
}
