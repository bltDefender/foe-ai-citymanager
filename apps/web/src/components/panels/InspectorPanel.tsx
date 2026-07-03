import React from 'react';
import { Box, Stack, Text, Badge, Group, Divider, ScrollArea } from '@mantine/core';
import { useAppStore } from '../../store/appStore.js';

export function InspectorPanel(): React.ReactElement {
  const { analyzedCity, city, selectedBuildingIds } = useAppStore();
  const displayCity = analyzedCity ?? city;

  const selectedId = selectedBuildingIds.size === 1 ? [...selectedBuildingIds][0] : null;
  const selectedBuilding = selectedId ? displayCity?.buildings.find((building) => building.id === selectedId) ?? null : null;

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
        <Text size="sm" fw={500}>Inspector</Text>
      </Box>

      <ScrollArea style={{ flex: 1 }}>
        <Stack gap="xs" style={{ padding: 12 }}>
          {selectedBuilding ? (
            <>
              <Text size="sm" fw={600}>{selectedBuilding.name}</Text>
              <Group gap="xs">
                <Badge size="xs" color="blue">{selectedBuilding.category}</Badge>
                <Badge size="xs" color="gray">{selectedBuilding.era}</Badge>
              </Group>
              <Divider />
              <Text size="xs" c="dimmed">Position: ({selectedBuilding.x}, {selectedBuilding.y})</Text>
              <Text size="xs" c="dimmed">Size: {selectedBuilding.width}×{selectedBuilding.height} = {selectedBuilding.width * selectedBuilding.height} tiles</Text>
              <Text size="xs" c="dimmed">Level: {selectedBuilding.level}</Text>
              <Text size="xs" c="dimmed">Road Required: {selectedBuilding.roadRequired ? 'Yes' : 'No'}</Text>
              <Text size="xs" c="dimmed">Connected: {selectedBuilding.connected ? 'Yes' : 'No'}</Text>
              <Text size="xs" c="dimmed">State: {selectedBuilding.state}</Text>
            </>
          ) : displayCity ? (
            <>
              <Text size="sm" fw={600}>{displayCity.owner}&apos;s City</Text>
              <Text size="xs" c="dimmed">Era: {displayCity.era}</Text>
              <Text size="xs" c="dimmed">Size: {displayCity.width}×{displayCity.height}</Text>
              <Text size="xs" c="dimmed">Buildings: {displayCity.buildings.length}</Text>
              <Text size="xs" c="dimmed">Road tiles: {displayCity.roads.length}</Text>
              {displayCity.statistics && (
                <>
                  <Divider />
                  <Text size="xs" c="dimmed">Efficiency: {(displayCity.statistics.efficiency * 100).toFixed(1)}%</Text>
                  <Text size="xs" c="dimmed">Road %: {displayCity.statistics.roadPercentage.toFixed(1)}%</Text>
                  <Text size="xs" c="dimmed">Great Buildings: {displayCity.statistics.greatBuildingCount}</Text>
                </>
              )}
              <Text size="xs" c="dimmed" style={{ marginTop: 8 }}>Click a building to inspect it</Text>
            </>
          ) : (
            <Text size="sm" c="dimmed">No city loaded</Text>
          )}
        </Stack>
      </ScrollArea>
    </Box>
  );
}
