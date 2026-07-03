import React from 'react';
import { Box, Text, ScrollArea, Stack, Badge, Group } from '@mantine/core';
import { useAppStore } from '../../store/appStore.js';

export function AIReportPanel(): React.ReactElement {
  const { optimizedCity, analyzedCity } = useAppStore();
  const city = optimizedCity ?? analyzedCity;
  const analysis = city?.analysis;

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
        <Text size="sm" fw={500}>AI Report</Text>
      </Box>
      <ScrollArea style={{ flex: 1 }}>
        <Stack gap={4} style={{ padding: 8 }}>
          {analysis ? (
            <>
              {analysis.warnings.length > 0 && (
                <Stack gap={2}>
                  {analysis.warnings.slice(0, 3).map((warning) => (
                    <Group key={warning.id} gap={4} wrap="nowrap">
                      <Badge size="xs" color={warning.level === 'Error' ? 'red' : warning.level === 'Warning' ? 'yellow' : 'blue'}>
                        {warning.level}
                      </Badge>
                      <Text size="xs" c="dimmed" style={{ flex: 1 }}>{warning.message}</Text>
                    </Group>
                  ))}
                </Stack>
              )}
              {analysis.suggestions.length > 0 && (
                <Stack gap={2} style={{ marginTop: 4 }}>
                  {analysis.suggestions.slice(0, 4).map((suggestion) => (
                    <Text key={suggestion.id} size="xs" c="dimmed">
                      • {suggestion.message}
                    </Text>
                  ))}
                </Stack>
              )}
              {analysis.warnings.length === 0 && analysis.suggestions.length === 0 && (
                <Text size="xs" c="green.6">✓ No issues detected</Text>
              )}
            </>
          ) : (
            <Text size="xs" c="dimmed">Analyze city to see report</Text>
          )}
        </Stack>
      </ScrollArea>
    </Box>
  );
}
