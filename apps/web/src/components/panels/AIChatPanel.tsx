import React, { useState, useCallback } from 'react';
import { Box, Group, Text, TextInput, ActionIcon, ScrollArea, Stack } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import { useAppStore } from '../../store/appStore.js';

export function AIChatPanel(): React.ReactElement {
  const [input, setInput] = useState('');
  const { conversation, addMessage, providerConfig } = useAppStore();

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    addMessage({
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    });
    setInput('');

    window.setTimeout(() => {
      addMessage({
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: `Configure a provider in **Settings** to enable live AI responses.\n\nYou asked: "${text}"`,
        timestamp: new Date(),
        provider: providerConfig.name,
        model: providerConfig.model,
      });
    }, 100);
  }, [addMessage, input, providerConfig]);

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#25262b', border: '1px solid #2c2e33', borderRadius: 4, overflow: 'hidden' }}>
      <Box style={{ padding: '6px 12px', borderBottom: '1px solid #2c2e33', background: '#2c2e33' }}>
        <Text size="sm" fw={500}>AI Chat</Text>
      </Box>
      <ScrollArea style={{ flex: 1 }}>
        <Stack gap={4} style={{ padding: 8 }}>
          {conversation.length === 0 ? (
            <Text size="xs" c="dimmed">Start a conversation with the AI...</Text>
          ) : (
            conversation.map((message) => (
              <Box
                key={message.id}
                style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: message.role === 'user' ? '#1c7ed622' : '#2c2e33',
                  border: `1px solid ${message.role === 'user' ? '#1c7ed644' : '#373a40'}`,
                }}
              >
                <Text size="xs" c={message.role === 'user' ? 'blue.4' : 'dimmed'} fw={500}>
                  {message.role === 'user' ? 'You' : 'AI'}
                </Text>
                {message.role === 'assistant' ? (
                  <Box style={{ fontSize: 12 }}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </Box>
                ) : (
                  <Text size="xs">{message.content}</Text>
                )}
              </Box>
            ))
          )}
        </Stack>
      </ScrollArea>
      <Group gap={4} style={{ padding: 8, borderTop: '1px solid #2c2e33' }}>
        <TextInput
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask the AI anything about your city..."
          size="xs"
          style={{ flex: 1 }}
        />
        <ActionIcon variant="light" color="blue" size="sm" onClick={handleSend} disabled={!input.trim()}>
          <IconSend size={14} />
        </ActionIcon>
      </Group>
    </Box>
  );
}
