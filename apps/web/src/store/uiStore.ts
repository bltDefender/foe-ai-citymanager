import { create } from 'zustand';

export type ActivePanel = 'city' | 'optimized' | 'inspector' | 'statistics' | 'report' | 'chat';

interface UIState {
  activePanel: ActivePanel;
  theme: 'dark' | 'light';
  showGrid: boolean;
  showHeatmap: boolean;
  showLegend: boolean;
  promptPreviewOpen: boolean;
  settingsOpen: boolean;
  responseViewerOpen: boolean;
  importModalOpen: boolean;
  tileSize: number;
}

interface UIActions {
  setActivePanel: (panel: ActivePanel) => void;
  toggleTheme: () => void;
  setShowGrid: (v: boolean) => void;
  setShowHeatmap: (v: boolean) => void;
  setShowLegend: (v: boolean) => void;
  setPromptPreviewOpen: (v: boolean) => void;
  setSettingsOpen: (v: boolean) => void;
  setResponseViewerOpen: (v: boolean) => void;
  setImportModalOpen: (v: boolean) => void;
  setTileSize: (v: number) => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  activePanel: 'city',
  theme: 'dark',
  showGrid: true,
  showHeatmap: false,
  showLegend: true,
  promptPreviewOpen: false,
  settingsOpen: false,
  responseViewerOpen: false,
  importModalOpen: false,
  tileSize: 32,

  setActivePanel: (panel) => set({ activePanel: panel }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setShowGrid: (v) => set({ showGrid: v }),
  setShowHeatmap: (v) => set({ showHeatmap: v }),
  setShowLegend: (v) => set({ showLegend: v }),
  setPromptPreviewOpen: (v) => set({ promptPreviewOpen: v }),
  setSettingsOpen: (v) => set({ settingsOpen: v }),
  setResponseViewerOpen: (v) => set({ responseViewerOpen: v }),
  setImportModalOpen: (v) => set({ importModalOpen: v }),
  setTileSize: (v) => set({ tileSize: v }),
}));
