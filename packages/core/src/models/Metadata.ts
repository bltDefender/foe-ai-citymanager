import type { Era } from './Era.js';

export interface Metadata {
  readonly gameVersion: string;
  readonly exportDate: Date;
  readonly foeHelperVersion: string;
  readonly playerName: string;
  readonly era: Era;
  readonly source: string;
  readonly checksum: string;
}
