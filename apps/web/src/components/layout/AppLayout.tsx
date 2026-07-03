import React from 'react';
import { Box, Stack } from '@mantine/core';
import { Toolbar } from './Toolbar.js';
import { StatusBar } from './StatusBar.js';
import { CityPanel } from '../panels/CityPanel.js';
import { InspectorPanel } from '../panels/InspectorPanel.js';
import { StatisticsPanel } from '../panels/StatisticsPanel.js';
import { AIReportPanel } from '../panels/AIReportPanel.js';
import { AIChatPanel } from '../panels/AIChatPanel.js';
import { ImportModal } from '../modals/ImportModal.js';
import { SettingsModal } from '../modals/SettingsModal.js';
import { useUIStore } from '../../store/uiStore.js';

export function AppLayout(): React.ReactElement {
  const { importModalOpen, settingsOpen, setImportModalOpen, setSettingsOpen } = useUIStore();

  return (
    <Stack gap={0} style={{ height: '100vh', overflow: 'hidden', background: '#1a1b1e' }}>
      <Toolbar />
      <Box
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) 320px',
          gridTemplateRows: 'minmax(0, 1fr) 220px',
          gap: 4,
          padding: 4,
        }}
      >
        <Box style={{ gridRow: '1', gridColumn: '1', overflow: 'hidden' }}>
          <CityPanel title="Original City" cityType="original" />
        </Box>
        <Box style={{ gridRow: '1', gridColumn: '2', overflow: 'hidden' }}>
          <CityPanel title="Optimized City" cityType="optimized" />
        </Box>
        <Box style={{ gridRow: '1', gridColumn: '3', overflow: 'hidden' }}>
          <InspectorPanel />
        </Box>
        <Box style={{ gridRow: '2', gridColumn: '1', overflow: 'hidden' }}>
          <StatisticsPanel />
        </Box>
        <Box style={{ gridRow: '2', gridColumn: '2', overflow: 'hidden' }}>
          <AIReportPanel />
        </Box>
        <Box style={{ gridRow: '2', gridColumn: '3', overflow: 'hidden' }}>
          <AIChatPanel />
        </Box>
      </Box>
      <StatusBar />
      <ImportModal opened={importModalOpen} onClose={() => setImportModalOpen(false)} />
      <SettingsModal opened={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Stack>
  );
}
