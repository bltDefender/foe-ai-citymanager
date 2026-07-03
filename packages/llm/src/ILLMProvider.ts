import type {
  LLMMessage,
  LLMRequest,
  LLMResponse,
  LLMStreamChunk,
  ProviderCapabilities,
  ProviderConfig,
} from './types/index.js';

export interface ILLMProvider {
  connect(config: ProviderConfig): Promise<void>;
  listModels(): Promise<string[]>;
  send(request: LLMRequest): Promise<LLMResponse>;
  stream(request: LLMRequest): AsyncIterable<LLMStreamChunk>;
  cancel(): void;
  estimateTokens(messages: readonly LLMMessage[]): number;
  healthCheck(): Promise<boolean>;
  getCapabilities(): ProviderCapabilities;
}
