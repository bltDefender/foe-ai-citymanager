import type { City, AnalysisWarning, BuildingId } from '@forgemind/core';
import { WarningLevel } from '@forgemind/core';

let warningCounter = 0;

function nextId(): string {
  return `warning-${++warningCounter}`;
}

export function generateWarnings(
  city: City,
  connectivity: Map<BuildingId, boolean>,
): AnalysisWarning[] {
  warningCounter = 0;
  const warnings: AnalysisWarning[] = [];
  const stats = city.statistics;

  const disconnectedIds: BuildingId[] = [];
  for (const building of city.buildings) {
    if (building.roadRequired && connectivity.get(building.id) === false) {
      disconnectedIds.push(building.id);
    }
  }

  if (disconnectedIds.length > 0) {
    warnings.push({
      id: nextId(),
      level: WarningLevel.Error,
      message: `${disconnectedIds.length} building(s) are not connected to the road network`,
      buildingIds: disconnectedIds,
      x: 0,
      y: 0,
    });
  }

  if (stats && stats.roadPercentage > 20) {
    warnings.push({
      id: nextId(),
      level: WarningLevel.Warning,
      message: `Road tiles occupy ${stats.roadPercentage.toFixed(1)}% of the city (recommended: <20%)`,
      buildingIds: [],
      x: 0,
      y: 0,
    });
  }

  if (stats && stats.efficiency < 0.6) {
    warnings.push({
      id: nextId(),
      level: WarningLevel.Info,
      message: `City efficiency is ${(stats.efficiency * 100).toFixed(1)}% — consider reducing roads`,
      buildingIds: [],
      x: 0,
      y: 0,
    });
  }

  if (stats && stats.unusedPercentage > 40) {
    warnings.push({
      id: nextId(),
      level: WarningLevel.Info,
      message: `${stats.unusedPercentage.toFixed(1)}% of the city is unused — expand buildings`,
      buildingIds: [],
      x: 0,
      y: 0,
    });
  }

  return warnings;
}
