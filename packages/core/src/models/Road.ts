import type { RoadId } from './ids.js';
import type { RoadType } from './RoadType.js';
import type { Era } from './Era.js';

export interface Road {
  readonly id: RoadId;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly roadType: RoadType;
  readonly connected: boolean;
  readonly era: Era;
  readonly metadata: Record<string, unknown>;
}
