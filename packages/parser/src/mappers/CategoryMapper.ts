import { BuildingCategory } from '@forgemind/core';
import { buildingTypeFromEntityId } from '../schema/FoeHelperSchema.js';

export function mapCategory(entityId: string, type?: string): BuildingCategory {
  const derivedType = type ?? buildingTypeFromEntityId(entityId);
  const t = derivedType.toLowerCase();
  const id = entityId.toLowerCase();

  if (t === 'street' || id.includes('street') || id.includes('_road') || t.includes('road') || t.includes('lane') || id.endsWith('_lane') || id.includes('alley') || id.includes('path')) {
    return BuildingCategory.Street;
  }
  if (t === 'main' || id.includes('mainbuilding') || id.includes('town_hall') || id.includes('townhall') || id.includes('cityhall')) {
    return BuildingCategory.MainBuilding;
  }
  if (t === 'greatbuilding' || id.includes('greatbuilding') || id.includes('gb_') || id.includes('arcbonus') || id.includes('_arc') || id.includes('alcatraz') || id.includes('chateau') || id.includes('colosseum') || id.includes('notre_dame') || id.includes('hagia') || id.includes('lighthouse_alexandria')) {
    return BuildingCategory.GreatBuilding;
  }
  if (t === 'residential' || id.includes('residential') || id.includes('_house') || id.includes('_hut') || id.includes('_cottage') || id.includes('_apartment')) {
    return BuildingCategory.Residential;
  }
  if (t === 'production' || id.includes('production') || id.includes('workshop') || id.includes('manufact') || id.includes('_forge') || id.includes('_mill')) {
    return BuildingCategory.Production;
  }
  if (t === 'goods' || id.includes('goods') || id.includes('_lumber') || id.includes('_marble') || id.includes('_dye') || id.includes('_ebony') || id.includes('_jewelry') || id.includes('_wine') || id.includes('_cloth') || id.includes('_stone')) {
    return BuildingCategory.Goods;
  }
  if (t === 'military' || id.includes('barracks') || id.includes('military') || id.includes('archery') || id.includes('_stable') || id.includes('siege') || id.includes('training') || id.includes('ballista')) {
    return BuildingCategory.Military;
  }
  if (t === 'culture' || id.includes('culture') || id.includes('_garden') || id.includes('_statue') || id.includes('_obelisk') || id.includes('theater') || id.includes('pantheon') || id.includes('museum')) {
    return BuildingCategory.Culture;
  }
  if (t === 'decoration' || id.includes('decoration') || id.includes('decor') || id.includes('ornament') || id.includes('fountain') || id.includes('_pond') || id.includes('flower')) {
    return BuildingCategory.Decoration;
  }
  if (t === 'event' || id.includes('event') || id.includes('seasonal') || id.includes('special_building')) {
    return BuildingCategory.EventBuilding;
  }
  if (t === 'tower' || id.includes('tower') || id.includes('watchpost')) {
    return BuildingCategory.Tower;
  }
  if (t === 'hub' || id.includes('_hub')) {
    return BuildingCategory.Hub;
  }
  return BuildingCategory.Unknown;
}

export function isRoadCategory(category: BuildingCategory): boolean {
  return category === BuildingCategory.Street;
}
