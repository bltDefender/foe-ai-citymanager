export const RoadType = {
  Dirt: 'Dirt',
  Gravel: 'Gravel',
  Paved: 'Paved',
  Cobblestone: 'Cobblestone',
  Lane: 'Lane',
  HighStreet: 'HighStreet',
  Fiber: 'Fiber',
  Unknown: 'Unknown',
} as const;

export type RoadType = (typeof RoadType)[keyof typeof RoadType];
