import { z } from 'zod';

export const FoeHelperEntitySchema = z.object({
  id: z.string(),
  cityentity_id: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  connected: z.number().optional(),
  needs_road: z.number().optional(),
  type: z.string().optional(),
  state: z.string().optional(),
  name: z.string().optional(),
  level: z.number().optional(),
  era: z.string().optional(),
  bonus: z.unknown().optional(),
  productions: z.unknown().optional(),
});

export type FoeHelperEntity = z.infer<typeof FoeHelperEntitySchema>;

export const FoeHelperV1Schema = z.object({
  version: z.literal(1),
  playerName: z.string().optional(),
  era: z.string().optional(),
  exportDate: z.string().optional(),
  width: z.number(),
  height: z.number(),
  entities: z.array(FoeHelperEntitySchema),
});

export type FoeHelperV1 = z.infer<typeof FoeHelperV1Schema>;

export const FoeHelperV2Schema = z.object({
  version: z.literal(2),
  foeHelperVersion: z.string().optional(),
  exportDate: z.string().optional(),
  player: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    era: z.string().optional(),
    world: z.string().optional(),
  }).optional(),
  city: z.object({
    width: z.number(),
    height: z.number(),
    entities: z.array(FoeHelperEntitySchema),
    roads: z.array(FoeHelperEntitySchema).optional(),
  }),
});

export type FoeHelperV2 = z.infer<typeof FoeHelperV2Schema>;

export function buildingTypeFromEntityId(entityId: string): string {
  const id = entityId.toLowerCase();
  if (id.includes('street') || id.includes('road') || id.includes('lane') || id.includes('alley') || id.includes('path')) {
    return 'street';
  }
  if (id.includes('mainbuilding') || id.includes('main_building') || id.includes('townhall') || id.includes('cityhall')) {
    return 'main';
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
