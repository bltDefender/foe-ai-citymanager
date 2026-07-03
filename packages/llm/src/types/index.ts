export interface LLMMessage {
  readonly role: 'system' | 'user' | 'assistant';
  readonly content: string;
}

export interface LLMRequest {
  readonly messages: readonly LLMMessage[];
  readonly model: string;
  readonly temperature: number;
  readonly maxTokens: number;
  readonly stream: boolean;
  readonly systemPrompt?: string;
}

export interface LLMUsage {
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly totalTokens: number;
}

export interface LLMResponse {
  readonly content: string;
  readonly model: string;
  readonly usage: LLMUsage;
  readonly finishReason: string;
}

export interface LLMStreamChunk {
  readonly delta: string;
  readonly done: boolean;
}

export interface ProviderCapabilities {
  readonly supportsStreaming: boolean;
  readonly supportsSystemPrompt: boolean;
  readonly maxContextTokens: number;
  readonly supportedModels: readonly string[];
}

export interface ProviderConfig {
  readonly id: string;
  readonly name: string;
  readonly endpoint: string;
  readonly apiKey?: string;
  readonly model: string;
  readonly temperature: number;
  readonly maxTokens: number;
  readonly streaming: boolean;
  readonly systemPromptOverride?: string;
}
