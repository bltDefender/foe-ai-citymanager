import React, { useState, useMemo, useCallback } from 'react';
import { Modal, Stack, Text, Button, Group, Textarea, Tabs } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FileDropZone } from '@forgemind/ui';
import { FoeHelperParser } from '@forgemind/parser';
import { useAppStore } from '../../store/appStore.js';

interface ImportModalProps {
  readonly opened: boolean;
  readonly onClose: () => void;
}

export function ImportModal({ opened, onClose }: ImportModalProps): React.ReactElement {
  const [pasteContent, setPasteContent] = useState('');
  const [preview, setPreview] = useState('');
  const { importCity } = useAppStore();
  const parser = useMemo(() => new FoeHelperParser(), []);

  const handleParse = useCallback((content: string) => {
    try {
      const city = parser.parse(content);
      setPreview(`✓ Parsed: ${city.buildings.length} buildings, ${city.roads.length} roads (${city.width}×${city.height})`);
      return city;
    } catch (error) {
      setPreview(`✗ Parse error: ${String(error)}`);
      return null;
    }
  }, [parser]);

  const handleFile = useCallback((_file: File, content: string) => {
    const city = handleParse(content);
    if (city) {
      importCity(city);
      notifications.show({ message: `Imported ${city.buildings.length} buildings`, color: 'green' });
      onClose();
    }
  }, [handleParse, importCity, onClose]);

  const handleImportPaste = useCallback(() => {
    const city = handleParse(pasteContent);
    if (city) {
      importCity(city);
      notifications.show({ message: `Imported ${city.buildings.length} buildings`, color: 'green' });
      onClose();
    }
  }, [handleParse, importCity, onClose, pasteContent]);

  return (
    <Modal opened={opened} onClose={onClose} title="Import City" size="lg">
      <Stack gap="md">
        <Tabs defaultValue="file">
          <Tabs.List>
            <Tabs.Tab value="file">Drop File</Tabs.Tab>
            <Tabs.Tab value="paste">Paste JSON</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="file" pt="md">
            <FileDropZone onFile={handleFile} accept=".json,application/json" label="Drop your FoE Helper city export here" />
          </Tabs.Panel>

          <Tabs.Panel value="paste" pt="md">
            <Stack gap="sm">
              <Textarea
                placeholder="Paste FoE Helper JSON export here..."
                value={pasteContent}
                onChange={(event) => {
                  setPasteContent(event.currentTarget.value);
                  setPreview('');
                }}
                minRows={8}
                maxRows={15}
                styles={{ input: { fontFamily: 'monospace', fontSize: 11 } }}
              />
              {preview && (
                <Text size="xs" c={preview.startsWith('✓') ? 'green' : 'red'}>
                  {preview}
                </Text>
              )}
              <Group justify="flex-end">
                <Button size="sm" variant="light" onClick={() => { handleParse(pasteContent); }}>
                  Preview
                </Button>
                <Button size="sm" onClick={handleImportPaste} disabled={!pasteContent.trim()}>
                  Import
                </Button>
              </Group>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Text size="xs" c="dimmed">
          Supports FoE Helper exports (version 1 and 2). Export from FoE Helper → City → Export JSON.
        </Text>
      </Stack>
    </Modal>
  );
}
