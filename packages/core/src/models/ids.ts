declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { readonly [__brand]: TBrand };

export type BuildingId = Brand<string, 'BuildingId'>;
export type RoadId = Brand<string, 'RoadId'>;
export type CityId = Brand<string, 'CityId'>;

export function makeBuildingId(id: string): BuildingId {
  return id as BuildingId;
}

export function makeRoadId(id: string): RoadId {
  return id as RoadId;
}

export function makeCityId(id: string): CityId {
  return id as CityId;
}
