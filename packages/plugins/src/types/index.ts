declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { readonly [__brand]: TBrand };
export type PluginId = Brand<string, 'PluginId'>;

export function makePluginId(id: string): PluginId {
  return id as PluginId;
}

export const PluginCapability = {
  LLMProvider: 'LLMProvider',
  KnowledgeProvider: 'KnowledgeProvider',
  ImportProvider: 'ImportProvider',
  ExportProvider: 'ExportProvider',
  RendererExtension: 'RendererExtension',
  StatisticsProvider: 'StatisticsProvider',
  PromptProvider: 'PromptProvider',
  Validator: 'Validator',
  Theme: 'Theme',
} as const;
export type PluginCapability = (typeof PluginCapability)[keyof typeof PluginCapability];

export const PluginStatus = {
  Loaded: 'Loaded',
  Active: 'Active',
  Inactive: 'Inactive',
  Error: 'Error',
} as const;
export type PluginStatus = (typeof PluginStatus)[keyof typeof PluginStatus];

export interface PluginMetadata {
  readonly id: PluginId;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly author: string;
  readonly capabilities: readonly PluginCapability[];
}

export interface IPlugin {
  readonly metadata: PluginMetadata;
  readonly status: PluginStatus;
  load(): Promise<void>;
  initialize(): Promise<void>;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
  unload(): Promise<void>;
}
