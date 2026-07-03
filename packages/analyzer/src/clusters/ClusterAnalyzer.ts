import type { City, Cluster, Building, BuildingId } from '@forgemind/core';
import { BuildingCategory } from '@forgemind/core';

function distance(a: Building, b: Building): number {
  const ax = a.x + a.width / 2;
  const ay = a.y + a.height / 2;
  const bx = b.x + b.width / 2;
  const by = b.y + b.height / 2;
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

export function findClusters(city: City): Cluster[] {
  const clusters: Cluster[] = [];
  const clusterCategories = [
    BuildingCategory.Residential,
    BuildingCategory.Production,
    BuildingCategory.Goods,
    BuildingCategory.Military,
    BuildingCategory.GreatBuilding,
    BuildingCategory.Culture,
  ];

  for (const category of clusterCategories) {
    const buildings = city.buildings.filter((b) => b.category === category);
    if (buildings.length === 0) continue;

    const visited = new Set<string>();
    const maxDist = 5;

    for (const building of buildings) {
      if (visited.has(building.id)) continue;
      const clusterBuildings: Building[] = [building];
      visited.add(building.id);

      for (const other of buildings) {
        if (visited.has(other.id)) continue;
        if (distance(building, other) <= maxDist) {
          clusterBuildings.push(other);
          visited.add(other.id);
        }
      }

      if (clusterBuildings.length >= 2) {
        const centroidX = clusterBuildings.reduce((sum, b) => sum + b.x + b.width / 2, 0) / clusterBuildings.length;
        const centroidY = clusterBuildings.reduce((sum, b) => sum + b.y + b.height / 2, 0) / clusterBuildings.length;

        clusters.push({
          id: `cluster-${category}-${clusters.length}`,
          buildingIds: clusterBuildings.map((b) => b.id) as readonly BuildingId[],
          centroid: { x: centroidX, y: centroidY },
          type: category,
        });
      }
    }
  }

  return clusters;
}
