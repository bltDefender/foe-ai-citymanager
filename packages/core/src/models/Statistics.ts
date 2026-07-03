export interface Statistics {
  readonly tileCount: number;
  readonly occupiedTiles: number;
  readonly roadTiles: number;
  readonly unusedTiles: number;
  readonly buildingTiles: number;
  readonly decorationTiles: number;
  readonly cultureTiles: number;
  readonly militaryTiles: number;
  readonly productionTiles: number;
  readonly goodsTiles: number;
  readonly residentialTiles: number;
  readonly roadPercentage: number;
  readonly unusedPercentage: number;
  readonly occupiedPercentage: number;
  readonly efficiency: number;
  readonly buildingCount: number;
  readonly greatBuildingCount: number;
}
