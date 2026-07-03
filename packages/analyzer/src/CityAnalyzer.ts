import type { City, Analysis, AnalysisMetrics, HeatmapCell } from '@forgemind/core';
import { calculateStatistics } from './statistics/StatisticsCalculator.js';
import { buildRoadGraph } from './graph/RoadGraphBuilder.js';
import { analyzeConnectivity, detectDeadEnds } from './graph/ConnectivityAnalyzer.js';
import { generateRoadDistanceHeatmap, generateDensityHeatmap, generateEfficiencyHeatmap } from './heatmap/HeatmapGenerator.js';
import { findLargestFreeRectangle } from './space/LargestRectangleFinder.js';
import { calculateFragmentation } from './space/FragmentationCalculator.js';
import { findClusters } from './clusters/ClusterAnalyzer.js';
import { generateWarnings } from './warnings/WarningGenerator.js';
import { generateSuggestions } from './suggestions/SuggestionGenerator.js';

export class CityAnalyzer {
  async analyze(city: City): Promise<City> {
    const statistics = calculateStatistics(city);
    const cityWithStats: City = { ...city, statistics };

    const roadGraph = buildRoadGraph(cityWithStats);
    const reachability = analyzeConnectivity(cityWithStats, roadGraph);
    const deadEnds = detectDeadEnds(roadGraph);
    const clusters = findClusters(cityWithStats);

    const largestFreeRect = findLargestFreeRectangle(cityWithStats);
    const fragmentation = calculateFragmentation(cityWithStats);

    let connectedCount = 0;
    let roadRequiredCount = 0;
    for (const building of cityWithStats.buildings) {
      if (building.roadRequired) {
        roadRequiredCount++;
        if (reachability.get(building.id) === true) connectedCount++;
      }
    }
    const connectedBuildingRatio = roadRequiredCount > 0 ? connectedCount / roadRequiredCount : 1;

    const roadDistanceHeatmap = generateRoadDistanceHeatmap(cityWithStats);
    let totalDist = 0;
    let buildingCellCount = 0;
    for (const building of cityWithStats.buildings) {
      const centerX = Math.floor(building.x + building.width / 2);
      const centerY = Math.floor(building.y + building.height / 2);
      const cell = roadDistanceHeatmap.find((c) => c.x === centerX && c.y === centerY);
      if (cell) {
        totalDist += cell.value * 10;
        buildingCellCount++;
      }
    }
    const avgRoadDistance = buildingCellCount > 0 ? totalDist / buildingCellCount : 0;

    const buildingDensity = statistics.tileCount > 0 ? statistics.buildingTiles / statistics.tileCount : 0;

    const metrics: AnalysisMetrics = {
      roadPercentage: statistics.roadPercentage,
      unusedPercentage: statistics.unusedPercentage,
      occupiedPercentage: statistics.occupiedPercentage,
      efficiency: statistics.efficiency,
      fragmentation,
      buildingDensity,
      avgRoadDistance,
      largestFreeRectangle: { width: largestFreeRect.width, height: largestFreeRect.height },
      connectedBuildingRatio,
    };

    const interimAnalysis: Analysis = {
      warnings: [],
      suggestions: [],
      metrics,
      heatmaps: new Map<string, readonly HeatmapCell[]>(),
      clusters,
      roadGraph,
      deadEnds,
      reachability,
    };
    const cityWithAnalysisContext: City = { ...cityWithStats, analysis: interimAnalysis };

    const warnings = generateWarnings(cityWithStats, reachability);
    const suggestions = generateSuggestions(cityWithAnalysisContext, metrics);

    const heatmaps = new Map<string, readonly HeatmapCell[]>();
    heatmaps.set('roadDistance', roadDistanceHeatmap);
    heatmaps.set('density', generateDensityHeatmap(cityWithStats));
    heatmaps.set('efficiency', generateEfficiencyHeatmap(cityWithStats));

    const analysis: Analysis = {
      warnings,
      suggestions,
      metrics,
      heatmaps,
      clusters,
      roadGraph,
      deadEnds,
      reachability,
    };

    return { ...cityWithStats, analysis };
  }
}
