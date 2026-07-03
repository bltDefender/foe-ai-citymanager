import { create } from 'zustand';
import type { City, BuildingId } from '@forgemind/core';
import type { ProviderConfig } from '@forgemind/llm';
import type { Project } from '@forgemind/project';
import type { ValidationResult } from '@forgemind/validator';

export interface ConversationMessage {
  readonly id: string;
  readonly role: 'user' | 'assistant' | 'system';
  readonly content: string;
  readonly timestamp: Date;
  readonly provider?: string;
  readonly model?: string;
}

interface AppState {
  city: City | null;
  analyzedCity: City | null;
  optimizedCity: City | null;
  selectedBuildingIds: Set<BuildingId>;
  currentProject: Project | null;
  providerConfig: ProviderConfig;
  isAnalyzing: boolean;
  isOptimizing: boolean;
  conversation: ConversationMessage[];
  lastValidationResult: ValidationResult | null;
}

interface AppActions {
  importCity: (city: City) => void;
  setAnalyzedCity: (city: City | null) => void;
  setOptimizedCity: (city: City | null) => void;
  selectBuilding: (id: BuildingId, multi: boolean) => void;
  deselectAll: () => void;
  setCurrentProject: (project: Project | null) => void;
  updateProviderConfig: (config: Partial<ProviderConfig>) => void;
  setIsAnalyzing: (v: boolean) => void;
  setIsOptimizing: (v: boolean) => void;
  addMessage: (msg: ConversationMessage) => void;
  clearHistory: () => void;
  setLastValidationResult: (result: ValidationResult | null) => void;
}

const DEFAULT_PROVIDER: ProviderConfig = {
  id: 'openai',
  name: 'OpenAI',
  endpoint: 'https://api.openai.com/v1',
  model: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 4096,
  streaming: true,
};

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  city: null,
  analyzedCity: null,
  optimizedCity: null,
  selectedBuildingIds: new Set<BuildingId>(),
  currentProject: null,
  providerConfig: DEFAULT_PROVIDER,
  isAnalyzing: false,
  isOptimizing: false,
  conversation: [],
  lastValidationResult: null,

  importCity: (city) => set({
    city,
    analyzedCity: null,
    optimizedCity: null,
    selectedBuildingIds: new Set<BuildingId>(),
    lastValidationResult: null,
  }),

  setAnalyzedCity: (city) => set({ analyzedCity: city }),
  setOptimizedCity: (city) => set({ optimizedCity: city }),

  selectBuilding: (id, multi) => {
    const current = get().selectedBuildingIds;
    const next = new Set(current);
    if (multi) {
      if (next.has(id)) next.delete(id);
      else next.add(id);
    } else {
      next.clear();
      next.add(id);
    }
    set({ selectedBuildingIds: next });
  },

  deselectAll: () => set({ selectedBuildingIds: new Set<BuildingId>() }),
  setCurrentProject: (project) => set({ currentProject: project }),
  updateProviderConfig: (config) => set((state) => ({ providerConfig: { ...state.providerConfig, ...config } })),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  setIsOptimizing: (v) => set({ isOptimizing: v }),
  addMessage: (msg) => set((state) => ({ conversation: [...state.conversation, msg] })),
  clearHistory: () => set({ conversation: [] }),
  setLastValidationResult: (result) => set({ lastValidationResult: result }),
}));
