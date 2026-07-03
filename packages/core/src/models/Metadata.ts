import type { Era } from './Era.js';

export interface Coordinate {
  readonly x: number;
  readonly y: number;
}

export interface MapSize {
  readonly width: number;
  readonly height: number;
}

export interface UnlockedAreaMetadata {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface Metadata {
  readonly gameVersion: string;
  readonly exportDate: Date;
  readonly foeHelperVersion: string;
  readonly playerName: string;
  readonly era: Era;
  readonly source: string;
  readonly checksum: string;
  readonly parserWarnings?: readonly string[];
  readonly availableMapSize?: MapSize;
  readonly unlockedAreas?: readonly UnlockedAreaMetadata[];
  readonly unlockedCoordinates?: readonly Coordinate[];
  readonly expansionMap?: readonly (readonly boolean[])[];
}
