import { BaseProvider } from './BaseProvider.js';
import type {
  LLMRequest,
  LLMResponse,
  LLMStreamChunk,
  ProviderCapabilities,
  ProviderConfig,
} from '../types/index.js';
import { LLMError, LLMErrorCode } from '../errors/LLMError.js';

export class OpenAIProvider extends BaseProvider {
  async connect(config: ProviderConfig): Promise<void> {
    this.config = config;
  }

  async listModels(): Promise<string[]> {
    const cfg = this.assertConfig();
    const response = await fetch(`${cfg.endpoint}/models`, {
      headers: this.buildHeaders(cfg),
    });

    if (!response.ok) {
      const body = await this.parseErrorResponse(response);
      throw LLMError.fromStatus(response.status, body);
    }

    const data = (await response.json()) as { data: Array<{ id: string }> };
    return data.data.map((model) => model.id);
  }

  async send(request: LLMRequest): Promise<LLMResponse> {
    const cfg = this.assertConfig();
    const ctrl = this.newAbortController();

    const messages = request.systemPrompt
      ? [{ role: 'system' as const, content: request.systemPrompt }, ...request.messages]
      : [...request.messages];

    const response = await fetch(`${cfg.endpoint}/chat/completions`, {
      method: 'POST',
      headers: this.buildHeaders(cfg),
      body: JSON.stringify({
        model: request.model,
        messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        stream: false,
      }),
      signal: ctrl.signal,
    });

    if (!response.ok) {
      const body = await this.parseErrorResponse(response);
      throw LLMError.fromStatus(response.status, body);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string }; finish_reason: string }>;
      model: string;
      usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    };

    const choice = data.choices[0];
    if (!choice) {
      throw new LLMError(LLMErrorCode.InvalidResponse, 'No choices in response');
    }

    return {
      content: choice.message.content,
      model: data.model,
      usage: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
      finishReason: choice.finish_reason,
    };
  }

  async *stream(request: LLMRequest): AsyncIterable<LLMStreamChunk> {
    const cfg = this.assertConfig();
    const ctrl = this.newAbortController();

    const messages = request.systemPrompt
      ? [{ role: 'system' as const, content: request.systemPrompt }, ...request.messages]
      : [...request.messages];

    const response = await fetch(`${cfg.endpoint}/chat/completions`, {
      method: 'POST',
      headers: this.buildHeaders(cfg),
      body: JSON.stringify({
        model: request.model,
        messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        stream: true,
      }),
      signal: ctrl.signal,
    });

    if (!response.ok) {
      const body = await this.parseErrorResponse(response);
      throw LLMError.fromStatus(response.status, body);
    }

    if (!response.body) {
      throw new LLMError(LLMErrorCode.StreamAborted, 'No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) {
            continue;
          }

          const json = trimmed.slice(6);
          if (json === '[DONE]') {
            yield { delta: '', done: true };
            return;
          }

          try {
            const chunk = JSON.parse(json) as {
              choices: Array<{ delta: { content?: string }; finish_reason: string | null }>;
            };
            const delta = chunk.choices[0]?.delta.content ?? '';
            const finishReason = chunk.choices[0]?.finish_reason;
            yield {
              delta,
              done: finishReason !== null && finishReason !== undefined && finishReason !== '',
            };
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const cfg = this.assertConfig();
      const response = await fetch(`${cfg.endpoint}/models`, {
        headers: this.buildHeaders(cfg),
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  getCapabilities(): ProviderCapabilities {
    return {
      supportsStreaming: true,
      supportsSystemPrompt: true,
      maxContextTokens: 128000,
      supportedModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    };
  }

  protected buildHeaders(config: ProviderConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.apiKey) {
      headers.Authorization = ['Bearer', config.apiKey].join(' ');
    }

    return headers;
  }
}
