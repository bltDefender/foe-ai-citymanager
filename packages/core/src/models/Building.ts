import type { BuildingId } from './ids.js';
import type { BuildingCategory } from './BuildingCategory.js';
import type { Era } from './Era.js';
import type { BuildingState } from './BuildingState.js';
import type { Production } from './Production.js';
import type { Bonus } from './Bonus.js';

export interface Building {
  readonly id: BuildingId;
  readonly entityId: string;
  readonly name: string;
  readonly type: BuildingCategory;
  readonly category: BuildingCategory;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly rotation: number;
  readonly connected: boolean;
  readonly roadRequired: boolean;
  readonly era: Era;
  readonly level: number;
  readonly state: BuildingState;
  readonly productions: readonly Production[];
  readonly bonuses: readonly Bonus[];
  readonly tags: readonly string[];
  readonly metadata: Record<string, unknown>;
}
