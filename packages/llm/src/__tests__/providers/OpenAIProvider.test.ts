import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenAIProvider } from '../../providers/OpenAIProvider.js';
import { LLMErrorCode } from '../../errors/LLMError.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function makeConfig() {
  return {
    id: 'openai',
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1',
    apiKey: 'test-key',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2048,
    streaming: false,
  };
}

describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;

  beforeEach(async () => {
    provider = new OpenAIProvider();
    await provider.connect(makeConfig());
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sends a chat completion request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Hello!' }, finish_reason: 'stop' }],
        model: 'gpt-4o',
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      }),
    });

    const response = await provider.send({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 100,
      stream: false,
    });

    expect(response.content).toBe('Hello!');
    expect(response.usage.totalTokens).toBe(15);
    expect(response.finishReason).toBe('stop');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Bearer\s+/),
        }),
      }),
    );
  });

  it('throws LLMError on 401', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    await expect(
      provider.send({
        messages: [{ role: 'user', content: 'Hi' }],
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 100,
        stream: false,
      }),
    ).rejects.toMatchObject({ code: LLMErrorCode.AuthenticationFailed });
  });

  it('throws LLMError on 429', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => 'Rate limited',
    });

    await expect(
      provider.send({
        messages: [{ role: 'user', content: 'Hi' }],
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 100,
        stream: false,
      }),
    ).rejects.toMatchObject({ code: LLMErrorCode.RateLimited });
  });

  it('returns capabilities', () => {
    const caps = provider.getCapabilities();
    expect(caps.supportsStreaming).toBe(true);
    expect(caps.supportsSystemPrompt).toBe(true);
    expect(caps.supportedModels).toContain('gpt-4o');
  });
});
