import React, { useCallback } from 'react';
import { Group, Button, Text, Tooltip, Divider } from '@mantine/core';
import { IconBrain, IconGridDots, IconSettings, IconSparkles } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { CityAnalyzer } from '@forgemind/analyzer';
import { useAppStore } from '../../store/appStore.js';
import { useUIStore } from '../../store/uiStore.js';

export function Toolbar(): React.ReactElement {
  const {
    city,
    analyzedCity,
    isAnalyzing,
    isOptimizing,
    setAnalyzedCity,
    setOptimizedCity,
    setIsAnalyzing,
    setIsOptimizing,
  } = useAppStore();
  const { setImportModalOpen, setSettingsOpen, showGrid, setShowGrid, showHeatmap, setShowHeatmap } = useUIStore();

  const handleAnalyze = useCallback(async () => {
    if (!city || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const analyzer = new CityAnalyzer();
      const analyzed = await analyzer.analyze(city);
      setAnalyzedCity(analyzed);
      notifications.show({ message: 'Analysis complete', color: 'green' });
    } catch (error) {
      notifications.show({ message: `Analysis failed: ${String(error)}`, color: 'red' });
    } finally {
      setIsAnalyzing(false);
    }
  }, [city, isAnalyzing, setAnalyzedCity, setIsAnalyzing]);

  const handleOptimize = useCallback(async () => {
    if (!city || isOptimizing) return;
    setIsOptimizing(true);
    try {
      if (!analyzedCity) {
        const analyzer = new CityAnalyzer();
        const analyzed = await analyzer.analyze(city);
        setAnalyzedCity(analyzed);
        setOptimizedCity(analyzed);
      } else {
        setOptimizedCity(analyzedCity);
      }
      notifications.show({ message: 'Optimization preview ready', color: 'violet' });
    } catch (error) {
      notifications.show({ message: `Optimization failed: ${String(error)}`, color: 'red' });
    } finally {
      setIsOptimizing(false);
    }
  }, [analyzedCity, city, isOptimizing, setAnalyzedCity, setIsOptimizing, setOptimizedCity]);

  return (
    <Group
      gap="xs"
      style={{
        padding: '6px 12px',
        background: '#25262b',
        borderBottom: '1px solid #2c2e33',
        height: 48,
      }}
    >
      <Group gap={6}>
        <IconBrain size={18} color="#4dabf7" />
        <Text size="sm" fw={700} c="blue.4">ForgeMind</Text>
      </Group>

      <Divider orientation="vertical" />

      <Button size="xs" variant="light" onClick={() => setImportModalOpen(true)}>
        Import
      </Button>
      <Button size="xs" variant="light" color="teal" disabled={!city || isAnalyzing} loading={isAnalyzing} onClick={() => void handleAnalyze()}>
        Analyze
      </Button>
      <Button
        size="xs"
        variant="light"
        color="violet"
        leftSection={<IconSparkles size={14} />}
        disabled={!city || isOptimizing}
        loading={isOptimizing}
        onClick={() => void handleOptimize()}
      >
        Optimize
      </Button>

      <Divider orientation="vertical" />

      <Tooltip label={showGrid ? 'Hide Grid' : 'Show Grid'}>
        <Button size="xs" variant={showGrid ? 'filled' : 'subtle'} leftSection={<IconGridDots size={14} />} onClick={() => setShowGrid(!showGrid)}>
          Grid
        </Button>
      </Tooltip>
      <Tooltip label={showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}>
        <Button size="xs" variant={showHeatmap ? 'filled' : 'subtle'} color="orange" onClick={() => setShowHeatmap(!showHeatmap)}>
          Heatmap
        </Button>
      </Tooltip>

      <div style={{ flex: 1 }} />

      <Button size="xs" variant="subtle" leftSection={<IconSettings size={14} />} onClick={() => setSettingsOpen(true)}>
        Settings
      </Button>
    </Group>
  );
}
