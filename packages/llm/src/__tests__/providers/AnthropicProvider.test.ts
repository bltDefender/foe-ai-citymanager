import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AnthropicProvider } from '../../providers/AnthropicProvider.js';
import { LLMErrorCode } from '../../errors/LLMError.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function makeConfig() {
  return {
    id: 'anthropic',
    name: 'Anthropic',
    endpoint: 'https://api.anthropic.com',
    apiKey: 'test-key',
    model: 'claude-opus-4-5',
    temperature: 0.7,
    maxTokens: 2048,
    streaming: false,
  };
}

describe('AnthropicProvider', () => {
  let provider: AnthropicProvider;

  beforeEach(async () => {
    provider = new AnthropicProvider();
    await provider.connect(makeConfig());
    mockFetch.mockReset();
  });

  it('sends a messages request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Hello from Claude!' }],
        model: 'claude-opus-4-5',
        stop_reason: 'end_turn',
        usage: { input_tokens: 10, output_tokens: 6 },
      }),
    });

    const response = await provider.send({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'claude-opus-4-5',
      temperature: 0.7,
      maxTokens: 100,
      stream: false,
    });

    expect(response.content).toBe('Hello from Claude!');
    expect(response.usage.totalTokens).toBe(16);
  });

  it('throws LLMError on authentication failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    await expect(
      provider.send({
        messages: [{ role: 'user', content: 'Hi' }],
        model: 'claude-opus-4-5',
        temperature: 0.7,
        maxTokens: 100,
        stream: false,
      }),
    ).rejects.toMatchObject({ code: LLMErrorCode.AuthenticationFailed });
  });

  it('returns capabilities', () => {
    const caps = provider.getCapabilities();
    expect(caps.supportsStreaming).toBe(true);
    expect(caps.maxContextTokens).toBeGreaterThan(100000);
  });

  it('lists models', async () => {
    const models = await provider.listModels();
    expect(models).toContain('claude-opus-4-5');
  });
});
