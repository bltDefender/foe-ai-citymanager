import React from 'react';
import { Box, SimpleGrid, Text } from '@mantine/core';
import { useAppStore } from '../../store/appStore.js';

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly color?: string;
}

function StatCard({ label, value, color = '#c1c2c5' }: StatCardProps): React.ReactElement {
  return (
    <Box style={{ background: '#2c2e33', borderRadius: 4, padding: '8px 10px', border: '1px solid #373a40' }}>
      <Text size="xs" c="dimmed">{label}</Text>
      <Text size="sm" fw={600} c={color}>{value}</Text>
    </Box>
  );
}

export function StatisticsPanel(): React.ReactElement {
  const { analyzedCity } = useAppStore();
  const stats = analyzedCity?.statistics;

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
      <Box style={{ padding: '6px 12px', borderBottom: '1px solid #2c2e33', background: '#2c2e33' }}>
        <Text size="sm" fw={500}>Statistics</Text>
      </Box>
      <Box style={{ flex: 1, padding: 8, overflow: 'auto' }}>
        {stats ? (
          <SimpleGrid cols={3} spacing={4}>
            <StatCard label="Road %" value={`${stats.roadPercentage.toFixed(1)}%`} color={stats.roadPercentage > 20 ? '#ff6b6b' : '#69db7c'} />
            <StatCard label="Buildings %" value={`${((stats.buildingTiles / stats.tileCount) * 100).toFixed(1)}%`} />
            <StatCard label="Unused %" value={`${stats.unusedPercentage.toFixed(1)}%`} />
            <StatCard label="Efficiency" value={`${(stats.efficiency * 100).toFixed(1)}%`} color={stats.efficiency > 0.8 ? '#69db7c' : stats.efficiency > 0.6 ? '#ffa94d' : '#ff6b6b'} />
            <StatCard label="Buildings" value={`${stats.buildingCount}`} />
            <StatCard label="Great Buildings" value={`${stats.greatBuildingCount}`} color="#c77dff" />
          </SimpleGrid>
        ) : (
          <Text size="xs" c="dimmed" style={{ padding: 8 }}>Analyze city to see statistics</Text>
        )}
      </Box>
    </Box>
  );
}
