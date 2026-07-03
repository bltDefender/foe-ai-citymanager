import type { CityId } from './ids.js';
import type { Era } from './Era.js';
import type { Building } from './Building.js';
import type { Road } from './Road.js';
import type { Statistics } from './Statistics.js';
import type { Metadata } from './Metadata.js';
import type { Analysis } from './Analysis.js';

export interface City {
  readonly id: CityId;
  readonly width: number;
  readonly height: number;
  readonly era: Era;
  readonly owner: string;
  readonly buildings: readonly Building[];
  readonly roads: readonly Road[];
  readonly statistics: Statistics | null;
  readonly metadata: Metadata;
  readonly analysis: Analysis | null;
}
