import { z } from 'zod';

const NumericLikeSchema = z.union([z.number(), z.string()]);
const BooleanLikeSchema = z.union([z.boolean(), z.number(), z.string()]);

export const FoeHelperEntitySchema = z.object({
  id: z.string(),
  cityentity_id: z.string(),
  x: NumericLikeSchema,
  y: NumericLikeSchema,
  width: NumericLikeSchema.optional(),
  height: NumericLikeSchema.optional(),
  length: NumericLikeSchema.optional(),
  connected: BooleanLikeSchema.optional(),
  needs_road: BooleanLikeSchema.optional(),
  type: z.string().optional(),
  state: z.string().optional(),
  name: z.string().optional(),
  level: NumericLikeSchema.optional(),
  era: z.string().optional(),
  bonus: z.unknown().optional(),
  productions: z.unknown().optional(),
}).passthrough();

export type FoeHelperEntity = z.infer<typeof FoeHelperEntitySchema>;

export const FoeHelperEntityDefinitionSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.string().optional(),
  width: NumericLikeSchema.optional(),
  length: NumericLikeSchema.optional(),
  requirements: z.object({
    street_connection_level: NumericLikeSchema.optional(),
  }).passthrough().optional(),
  components: z.object({
    AllAge: z.object({
      placement: z.object({
        size: z.object({
          x: NumericLikeSchema.optional(),
          y: NumericLikeSchema.optional(),
        }).passthrough().optional(),
      }).passthrough().optional(),
      streetConnectionRequirement: z.object({
        requiredLevel: NumericLikeSchema.optional(),
      }).passthrough().optional(),
    }).passthrough().optional(),
    streetConnectionRequirement: z.object({
      requiredLevel: NumericLikeSchema.optional(),
    }).passthrough().optional(),
  }).passthrough().optional(),
}).passthrough();

export type FoeHelperEntityDefinition = z.infer<typeof FoeHelperEntityDefinitionSchema>;

export const FoeHelperUnlockedAreaSchema = z.object({
  x: NumericLikeSchema,
  y: NumericLikeSchema,
  width: NumericLikeSchema.optional(),
  length: NumericLikeSchema.optional(),
  height: NumericLikeSchema.optional(),
}).passthrough();

export type FoeHelperUnlockedArea = z.infer<typeof FoeHelperUnlockedAreaSchema>;

export const FoeHelperCurrentExportSchema = z.object({
  CityMapData: z.record(FoeHelperEntitySchema),
  CityEntities: z.record(FoeHelperEntityDefinitionSchema),
  UnlockedAreas: z.array(FoeHelperUnlockedAreaSchema),
}).passthrough();

export type FoeHelperCurrentExport = z.infer<typeof FoeHelperCurrentExportSchema>;

export function buildingTypeFromEntityId(entityId: string): string {
  const id = entityId.toLowerCase();
  if (id.includes('street') || id.includes('road') || id.includes('lane') || id.includes('alley') || id.includes('path')) {
    return 'street';
  }
  if (id.includes('mainbuilding') || id.includes('main_building') || id.includes('townhall') || id.includes('cityhall')) {
    return 'main_building';
  }
  if (id.includes('greatbuilding') || id.includes('gb_') || id.includes('arcbonus') || id.includes('colosseum') || id.includes('notre_dame') || id.includes('hagia') || id.includes('alcatraz') || id.includes('chateau') || id.includes('arc_')) {
    return 'greatbuilding';
  }
  if (id.includes('residential') || id.includes('house') || id.includes('hut') || id.includes('cottage') || id.includes('apartment')) {
    return 'residential';
  }
  if (id.includes('production') || id.includes('workshop') || id.includes('forge') || id.includes('manufact') || id.includes('mill')) {
    return 'production';
  }
  if (id.includes('goods') || id.includes('lumber') || id.includes('marble') || id.includes('dye') || id.includes('ebony') || id.includes('jewelry') || id.includes('wine') || id.includes('cloth') || id.includes('stone')) {
    return 'goods';
  }
  if (id.includes('barracks') || id.includes('military') || id.includes('archery') || id.includes('stable') || id.includes('siege') || id.includes('ballista') || id.includes('training') || id.includes('troop')) {
    return 'military';
  }
  if (id.includes('culture') || id.includes('garden') || id.includes('statue') || id.includes('obelisk') || id.includes('theater') || id.includes('pantheon') || id.includes('museum')) {
    return 'culture';
  }
  if (id.includes('decoration') || id.includes('decor') || id.includes('ornament') || id.includes('fountain') || id.includes('pond') || id.includes('flower')) {
    return 'decoration';
  }
  if (id.includes('tower') || id.includes('watchpost') || id.includes('lighthouse')) {
    return 'tower';
  }
  if (id.includes('hub')) {
    return 'hub';
  }
  return 'unknown';
}
