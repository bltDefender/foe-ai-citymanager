import { describe, expect, it } from 'vitest';
import { OpenAIProvider } from '../providers/OpenAIProvider.js';
import type { LLMMessage } from '../types/index.js';

describe('estimateTokens', () => {
  const provider = new OpenAIProvider();

  it('estimates tokens as chars/4', () => {
    const messages: LLMMessage[] = [{ role: 'user', content: 'Hello world' }];
    const tokens = provider.estimateTokens(messages);
    expect(tokens).toBe(Math.ceil(11 / 4));
  });

  it('sums tokens across multiple messages', () => {
    const messages: LLMMessage[] = [
      { role: 'system', content: 'You are helpful.' },
      { role: 'user', content: 'Hello' },
    ];
    const tokens = provider.estimateTokens(messages);
    expect(tokens).toBe(Math.ceil(21 / 4));
  });

  it('returns 0 for empty messages', () => {
    const tokens = provider.estimateTokens([]);
    expect(tokens).toBe(0);
  });
});
