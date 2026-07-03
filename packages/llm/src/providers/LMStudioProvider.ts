import { OpenAIProvider } from './OpenAIProvider.js';
import type { ProviderCapabilities, ProviderConfig } from '../types/index.js';

export class LMStudioProvider extends OpenAIProvider {
  async connect(config: ProviderConfig): Promise<void> {
    this.config = {
      ...config,
      endpoint: config.endpoint || 'http://localhost:1234/v1',
    };
  }

  getCapabilities(): ProviderCapabilities {
    return {
      supportsStreaming: true,
      supportsSystemPrompt: true,
      maxContextTokens: 32768,
      supportedModels: [],
    };
  }
}
