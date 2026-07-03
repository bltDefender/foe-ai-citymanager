import { OpenAIProvider } from './OpenAIProvider.js';
import type { ProviderCapabilities, ProviderConfig } from '../types/index.js';

export class OpenRouterProvider extends OpenAIProvider {
  async connect(config: ProviderConfig): Promise<void> {
    this.config = {
      ...config,
      endpoint: config.endpoint || 'https://openrouter.ai/api/v1',
    };
  }

  getCapabilities(): ProviderCapabilities {
    return {
      supportsStreaming: true,
      supportsSystemPrompt: true,
      maxContextTokens: 128000,
      supportedModels: [
        'anthropic/claude-opus-4-5',
        'openai/gpt-4o',
        'meta-llama/llama-3.1-70b-instruct',
        'google/gemini-pro-1.5',
      ],
    };
  }
}
