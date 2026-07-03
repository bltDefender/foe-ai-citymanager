import type { Analysis, City } from '@forgemind/core';
import type { LLMMessage } from '@forgemind/llm';

export enum PromptBlockType {
  System = 'System',
  Knowledge = 'Knowledge',
  Template = 'Template',
  City = 'City',
  Analysis = 'Analysis',
  Goals = 'Goals',
  History = 'History',
  Schema = 'Schema',
}

export interface PromptBlock {
  readonly id: string;
  readonly type: PromptBlockType;
  readonly label: string;
  readonly content: string;
  readonly enabled: boolean;
  readonly order: number;
  readonly tokenCount: number;
}

export interface PromptTemplate {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly content: string;
  readonly tags: readonly string[];
}

export type BuiltinTemplate =
  | 'balanced'
  | 'attack'
  | 'forge_points'
  | 'space_saving'
  | 'goods'
  | 'experimental';

export interface OptimizationGoal {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly priority: number;
}

export interface PromptPackage {
  readonly id: string;
  readonly blocks: readonly PromptBlock[];
  readonly template: PromptTemplate | null;
  readonly goals: readonly OptimizationGoal[];
  readonly city: City | null;
  readonly analysis: Analysis | null;
  readonly timestamp: Date;
  readonly totalTokens: number;
}
