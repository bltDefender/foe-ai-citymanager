import type { BuildingId } from './ids.js';

export const WarningLevel = {
  Info: 'Info',
  Warning: 'Warning',
  Error: 'Error',
} as const;

export type WarningLevel = (typeof WarningLevel)[keyof typeof WarningLevel];

export interface AnalysisWarning {
  readonly id: string;
  readonly level: WarningLevel;
  readonly message: string;
  readonly buildingIds: readonly BuildingId[];
  readonly x: number;
  readonly y: number;
}

export interface AnalysisSuggestion {
  readonly id: string;
  readonly priority: number;
  readonly message: string;
  readonly reason: string;
  readonly confidence: number;
  readonly impact: number;
  readonly affectedBuildingIds: readonly BuildingId[];
  readonly dependencies: readonly string[];
}

export interface AnalysisMetrics {
  readonly roadPercentage: number;
  readonly unusedPercentage: number;
  readonly occupiedPercentage: number;
  readonly efficiency: number;
  readonly fragmentation: number;
  readonly buildingDensity: number;
  readonly avgRoadDistance: number;
  readonly largestFreeRectangle: { readonly width: number; readonly height: number };
  readonly connectedBuildingRatio: number;
}

export interface HeatmapCell {
  readonly x: number;
  readonly y: number;
  readonly value: number;
  readonly label: string;
}

export interface Cluster {
  readonly id: string;
  readonly buildingIds: readonly BuildingId[];
  readonly centroid: { readonly x: number; readonly y: number };
  readonly type: string;
}

export interface RoadNode {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly connections: readonly string[];
}

export interface RoadGraph {
  readonly nodes: Map<string, RoadNode>;
  readonly edges: ReadonlyArray<{ readonly from: string; readonly to: string; readonly weight: number }>;
}

export interface Analysis {
  readonly warnings: readonly AnalysisWarning[];
  readonly suggestions: readonly AnalysisSuggestion[];
  readonly metrics: AnalysisMetrics;
  readonly heatmaps: Map<string, readonly HeatmapCell[]>;
  readonly clusters: readonly Cluster[];
  readonly roadGraph: RoadGraph;
  readonly deadEnds: ReadonlyArray<{ readonly x: number; readonly y: number }>;
  readonly reachability: Map<BuildingId, boolean>;
}
