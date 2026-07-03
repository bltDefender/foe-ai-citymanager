import type { City } from '@forgemind/core';
import type { ProviderConfig } from '@forgemind/llm';
import type { ValidationResult } from '@forgemind/validator';

declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { readonly [__brand]: TBrand };
export type ProjectId = Brand<string, 'ProjectId'>;

export function makeProjectId(id: string): ProjectId {
  return id as ProjectId;
}

export interface ConversationEntry {
  readonly id: string;
  readonly role: 'user' | 'assistant' | 'system';
  readonly content: string;
  readonly timestamp: Date;
  readonly provider?: string;
  readonly model?: string;
  readonly tokens?: number;
}

export interface OptimizationRun {
  readonly id: string;
  readonly timestamp: Date;
  readonly provider: string;
  readonly model: string;
  readonly promptPackage: Record<string, unknown>;
  readonly response: string;
  readonly validationResult: ValidationResult;
  readonly city: City;
}

export interface ProjectSettings {
  readonly providerConfig: ProviderConfig;
  readonly theme: 'dark' | 'light';
  readonly tileSize: number;
  readonly showGrid: boolean;
}

export interface Project {
  readonly id: ProjectId;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly city: City | null;
  readonly conversation: readonly ConversationEntry[];
  readonly runs: readonly OptimizationRun[];
  readonly settings: ProjectSettings;
}
