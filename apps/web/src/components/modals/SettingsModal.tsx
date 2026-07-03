import React from 'react';
import { Modal, Stack, Tabs, TextInput, NumberInput, Select, Switch, Text, Group, Button } from '@mantine/core';
import { useAppStore } from '../../store/appStore.js';
import { useUIStore } from '../../store/uiStore.js';

interface SettingsModalProps {
  readonly opened: boolean;
  readonly onClose: () => void;
}

const PROVIDER_OPTIONS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'ollama', label: 'Ollama (Local)' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'lmstudio', label: 'LM Studio (Local)' },
];

export function SettingsModal({ opened, onClose }: SettingsModalProps): React.ReactElement {
  const { providerConfig, updateProviderConfig } = useAppStore();
  const { showGrid, setShowGrid, tileSize, setTileSize } = useUIStore();

  return (
    <Modal opened={opened} onClose={onClose} title="Settings" size="xl">
      <Tabs defaultValue="llm">
        <Tabs.List>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="llm">LLM Provider</Tabs.Tab>
          <Tabs.Tab value="rendering">Rendering</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="md">
          <Stack gap="sm">
            <Text size="sm" fw={500}>Application Settings</Text>
            <Switch label="Show grid in city view" checked={showGrid} onChange={(event) => setShowGrid(event.currentTarget.checked)} />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="llm" pt="md">
          <Stack gap="sm">
            <Select
              label="Provider"
              data={PROVIDER_OPTIONS}
              value={providerConfig.id}
              onChange={(value) => {
                if (value) {
                  updateProviderConfig({
                    id: value,
                    name: PROVIDER_OPTIONS.find((option) => option.value === value)?.label ?? value,
                  });
                }
              }}
            />
            <TextInput label="API Endpoint" value={providerConfig.endpoint} onChange={(event) => updateProviderConfig({ endpoint: event.currentTarget.value })} />
            <TextInput
              label="API Key"
              type="password"
              placeholder="sk-..."
              value={providerConfig.apiKey ?? ''}
              onChange={(event) => updateProviderConfig({ apiKey: event.currentTarget.value })}
            />
            <TextInput label="Model" value={providerConfig.model} onChange={(event) => updateProviderConfig({ model: event.currentTarget.value })} />
            <NumberInput
              label="Temperature"
              value={providerConfig.temperature}
              onChange={(value) => updateProviderConfig({ temperature: typeof value === 'number' ? value : 0.7 })}
              min={0}
              max={2}
              step={0.1}
            />
            <NumberInput
              label="Max Tokens"
              value={providerConfig.maxTokens}
              onChange={(value) => updateProviderConfig({ maxTokens: typeof value === 'number' ? value : 4096 })}
              min={256}
              max={128000}
              step={256}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="rendering" pt="md">
          <Stack gap="sm">
            <NumberInput
              label="Tile Size (px)"
              value={tileSize}
              onChange={(value) => setTileSize(typeof value === 'number' ? value : 32)}
              min={16}
              max={96}
              step={8}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt="md">
        <Button onClick={onClose}>Close</Button>
      </Group>
    </Modal>
  );
}
