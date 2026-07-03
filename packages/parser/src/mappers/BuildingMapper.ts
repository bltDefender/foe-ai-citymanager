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

function mapBuildingState(state?: string): BuildingState {
  if (!state) return BuildingState.Unknown;
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
    x: entity.x,
    y: entity.y,
    width: entity.width ?? 1,
    height: entity.height ?? 1,
    rotation: 0,
    connected: (entity.connected ?? 0) === 1,
    roadRequired: (entity.needs_road ?? 1) === 1,
    era,
    level: entity.level ?? 1,
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
    x: entity.x,
    y: entity.y,
    width: entity.width ?? 1,
    height: entity.height ?? 1,
    roadType: mapRoadType(entity.cityentity_id),
    connected: true,
    era: mapEra(entity.era),
    metadata: {
      rawEntityId: entity.cityentity_id,
    },
  };
}
