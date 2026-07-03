import type { ILLMProvider } from '../ILLMProvider.js';
import type {
  LLMMessage,
  LLMRequest,
  LLMResponse,
  LLMStreamChunk,
  ProviderCapabilities,
  ProviderConfig,
} from '../types/index.js';

export abstract class BaseProvider implements ILLMProvider {
  protected config: ProviderConfig | null = null;
  protected abortController: AbortController | null = null;

  abstract connect(config: ProviderConfig): Promise<void>;
  abstract listModels(): Promise<string[]>;
  abstract send(request: LLMRequest): Promise<LLMResponse>;
  abstract stream(request: LLMRequest): AsyncIterable<LLMStreamChunk>;
  abstract healthCheck(): Promise<boolean>;
  abstract getCapabilities(): ProviderCapabilities;

  cancel(): void {
    this.abortController?.abort();
    this.abortController = null;
  }

  estimateTokens(messages: readonly LLMMessage[]): number {
    const totalChars = messages.reduce((sum, message) => sum + message.content.length, 0);
    return Math.ceil(totalChars / 4);
  }

  protected newAbortController(): AbortController {
    this.abortController = new AbortController();
    return this.abortController;
  }

  protected assertConfig(): ProviderConfig {
    if (!this.config) {
      throw new Error('Provider not connected. Call connect() first.');
    }
    return this.config;
  }

  protected async parseErrorResponse(response: Response): Promise<string> {
    try {
      return await response.text();
    } catch {
      return `HTTP ${response.status}`;
    }
  }
}
