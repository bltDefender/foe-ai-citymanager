export const BuildingCategory = {
  MainBuilding: 'MainBuilding',
  GreatBuilding: 'GreatBuilding',
  EventBuilding: 'EventBuilding',
  Residential: 'Residential',
  Production: 'Production',
  Goods: 'Goods',
  Military: 'Military',
  Street: 'Street',
  Culture: 'Culture',
  Decoration: 'Decoration',
  Tower: 'Tower',
  Hub: 'Hub',
  Unknown: 'Unknown',
} as const;

export type BuildingCategory = (typeof BuildingCategory)[keyof typeof BuildingCategory];
