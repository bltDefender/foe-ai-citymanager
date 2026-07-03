export const BuildingState = {
  Idle: 'Idle',
  Collecting: 'Collecting',
  Producing: 'Producing',
  UnderConstruction: 'UnderConstruction',
  Motivated: 'Motivated',
  Polished: 'Polished',
  Unknown: 'Unknown',
} as const;

export type BuildingState = (typeof BuildingState)[keyof typeof BuildingState];
