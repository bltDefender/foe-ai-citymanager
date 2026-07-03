import React from 'react';
import { Box, Group, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { CityRenderer } from '@forgemind/renderer';
import type { BuildingId } from '@forgemind/core';
import { useAppStore } from '../../store/appStore.js';
import { useUIStore } from '../../store/uiStore.js';

interface CityPanelProps {
  readonly title: string;
  readonly cityType: 'original' | 'optimized';
}

export function CityPanel({ title, cityType }: CityPanelProps): React.ReactElement {
  const sizeResult = useElementSize();
  const ref = sizeResult.ref as React.RefObject<HTMLDivElement>;
  const { width, height } = sizeResult;
  const { city, analyzedCity, optimizedCity, selectedBuildingIds, selectBuilding, deselectAll } = useAppStore();
  const { showGrid, showHeatmap, tileSize } = useUIStore();

  const displayCity = cityType === 'original' ? (analyzedCity ?? city) : optimizedCity;
  const roadDistanceHeatmap = displayCity?.analysis?.heatmaps.get('roadDistance') ?? [];

  return (
    <Box
      style={{
        height: '100%',
        background: '#25262b',
        borderRadius: 4,
        border: '1px solid #2c2e33',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Group gap="xs" style={{ padding: '6px 12px', borderBottom: '1px solid #2c2e33', flexShrink: 0, background: '#2c2e33' }}>
        <Text size="sm" fw={500}>{title}</Text>
        {displayCity && (
          <Text size="xs" c="dimmed" style={{ marginLeft: 'auto' }}>
            {displayCity.era}
          </Text>
        )}
      </Group>

      <Box ref={ref} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {displayCity ? (
          <CityRenderer
            city={displayCity}
            config={{ showGrid, tileSize }}
            selectedBuildingIds={selectedBuildingIds}
            showHeatmap={showHeatmap}
            heatmap={showHeatmap ? [...roadDistanceHeatmap] : []}
            onSelectBuilding={(id: BuildingId, multi: boolean) => selectBuilding(id, multi)}
            onDeselectAll={deselectAll}
            width={Math.max(width, 320)}
            height={Math.max(height, 240)}
          />
        ) : (
          <Box
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#555',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <Text size="xl">🏙️</Text>
            <Text size="sm" c="dimmed">
              {cityType === 'original' ? 'Import a city to get started' : 'Optimize your city first'}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
