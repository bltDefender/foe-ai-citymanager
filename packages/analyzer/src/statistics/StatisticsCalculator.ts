import type { City, Statistics } from '@forgemind/core';
import { BuildingCategory } from '@forgemind/core';

export function calculateStatistics(city: City): Statistics {
  const tileCount = city.width * city.height;

  let roadTiles = 0;
  for (const road of city.roads) {
    roadTiles += road.width * road.height;
  }

  let buildingTiles = 0;
  let decorationTiles = 0;
  let cultureTiles = 0;
  let militaryTiles = 0;
  let productionTiles = 0;
  let goodsTiles = 0;
  let residentialTiles = 0;
  let greatBuildingCount = 0;

  for (const building of city.buildings) {
    const tiles = building.width * building.height;
    buildingTiles += tiles;
    if (building.category === BuildingCategory.GreatBuilding) greatBuildingCount++;
    switch (building.category) {
      case BuildingCategory.Decoration: decorationTiles += tiles; break;
      case BuildingCategory.Culture: cultureTiles += tiles; break;
      case BuildingCategory.Military: militaryTiles += tiles; break;
      case BuildingCategory.Production: productionTiles += tiles; break;
      case BuildingCategory.Goods: goodsTiles += tiles; break;
      case BuildingCategory.Residential: residentialTiles += tiles; break;
    }
  }

  const occupiedTiles = buildingTiles + roadTiles;
  const unusedTiles = Math.max(0, tileCount - occupiedTiles);
  const roadPercentage = tileCount > 0 ? (roadTiles / tileCount) * 100 : 0;
  const unusedPercentage = tileCount > 0 ? (unusedTiles / tileCount) * 100 : 0;
  const occupiedPercentage = tileCount > 0 ? (occupiedTiles / tileCount) * 100 : 0;
  const efficiency = occupiedTiles > 0 ? buildingTiles / occupiedTiles : 0;

  return {
    tileCount,
    occupiedTiles,
    roadTiles,
    unusedTiles,
    buildingTiles,
    decorationTiles,
    cultureTiles,
    militaryTiles,
    productionTiles,
    goodsTiles,
    residentialTiles,
    roadPercentage,
    unusedPercentage,
    occupiedPercentage,
    efficiency,
    buildingCount: city.buildings.length,
    greatBuildingCount,
  };
}
