import type { BuildingCategory, BuildingId } from '@forgemind/core';
import { CategoryColors } from '../colors/index.js';

export interface BuildingColor {
  readonly fill: string;
  readonly stroke: string;
  readonly text: string;
}

export type ColorScheme = Readonly<Record<BuildingCategory, BuildingColor>>;

export interface RenderConfig {
  readonly tileSize: number;
  readonly showGrid: boolean;
  readonly showTooltips: boolean;
  readonly showCoordinates: boolean;
  readonly colorScheme: ColorScheme;
}

export interface SelectionState {
  readonly selectedBuildingIds: Set<BuildingId>;
  readonly hoveredBuildingId: BuildingId | null;
}

export interface ViewportState {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly width: number;
  readonly height: number;
}

export type RenderEventType = 'click' | 'hover' | 'contextmenu' | 'deselect';

export interface RenderEvent {
  readonly type: RenderEventType;
  readonly buildingId?: BuildingId;
  readonly x?: number;
  readonly y?: number;
}

export const DEFAULT_RENDER_CONFIG: RenderConfig = {
  tileSize: 48,
  showGrid: true,
  showTooltips: true,
  showCoordinates: false,
  colorScheme: CategoryColors satisfies ColorScheme,
};
