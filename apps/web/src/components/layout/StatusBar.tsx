import React from 'react';
import { Group, Text } from '@mantine/core';
import { StatusBadge } from '@forgemind/ui';
import { useAppStore } from '../../store/appStore.js';

export function StatusBar(): React.ReactElement {
  const { city, analyzedCity, isAnalyzing, isOptimizing, providerConfig } = useAppStore();

  const status = isAnalyzing || isOptimizing ? 'warning' : city ? 'connected' : 'idle';
  const statusLabel = isAnalyzing ? 'Analyzing...' : isOptimizing ? 'Optimizing...' : city ? 'City Loaded' : 'Ready';

  return (
    <Group
      gap="md"
      style={{
        padding: '4px 12px',
        background: '#141517',
        borderTop: '1px solid #2c2e33',
        height: 28,
        fontSize: 11,
      }}
    >
      <StatusBadge status={status} label={statusLabel} />

      {city && (
        <Text size="xs" c="dimmed">
          {city.width}×{city.height} | {city.buildings.length} buildings | {city.roads.length} road tiles
        </Text>
      )}

      {analyzedCity?.statistics && (
        <Text size="xs" c="dimmed">
          Efficiency: {(analyzedCity.statistics.efficiency * 100).toFixed(1)}% | Roads: {analyzedCity.statistics.roadPercentage.toFixed(1)}%
        </Text>
      )}

      <div style={{ flex: 1 }} />

      <Text size="xs" c="dimmed">
        {providerConfig.name} · {providerConfig.model}
      </Text>
    </Group>
  );
}
