import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LLMProviderRegistry } from '../registry/LLMProviderRegistry.js';
import type { ILLMProvider } from '../ILLMProvider.js';

function makeMockProvider(): ILLMProvider {
  return {
    connect: vi.fn(),
    listModels: vi.fn().mockResolvedValue(['model-a']),
    send: vi.fn(),
    stream: vi.fn() as unknown as ILLMProvider['stream'],
    cancel: vi.fn(),
    estimateTokens: vi.fn().mockReturnValue(100),
    healthCheck: vi.fn().mockResolvedValue(true),
    getCapabilities: vi.fn().mockReturnValue({
      supportsStreaming: true,
      supportsSystemPrompt: true,
      maxContextTokens: 4096,
      supportedModels: [],
    }),
  };
}

describe('LLMProviderRegistry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers and retrieves a provider', () => {
    const registry = new LLMProviderRegistry();
    const provider = makeMockProvider();
    registry.register('openai', provider);
    expect(registry.get('openai')).toBe(provider);
  });

  it('lists registered providers', () => {
    const registry = new LLMProviderRegistry();
    registry.register('openai', makeMockProvider());
    registry.register('anthropic', makeMockProvider());
    expect(registry.list()).toContain('openai');
    expect(registry.list()).toContain('anthropic');
    expect(registry.list()).toHaveLength(2);
  });

  it('throws when getting non-existent provider', () => {
    const registry = new LLMProviderRegistry();
    expect(() => registry.get('nonexistent')).toThrow();
  });

  it('checks provider existence', () => {
    const registry = new LLMProviderRegistry();
    registry.register('openai', makeMockProvider());
    expect(registry.has('openai')).toBe(true);
    expect(registry.has('anthropic')).toBe(false);
  });

  it('unregisters a provider', () => {
    const registry = new LLMProviderRegistry();
    registry.register('openai', makeMockProvider());
    registry.unregister('openai');
    expect(registry.has('openai')).toBe(false);
  });
});
