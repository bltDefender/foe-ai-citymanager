import { BaseProvider } from './BaseProvider.js';
import type {
  LLMRequest,
  LLMResponse,
  LLMStreamChunk,
  ProviderCapabilities,
  ProviderConfig,
} from '../types/index.js';
import { LLMError, LLMErrorCode } from '../errors/LLMError.js';

export class OllamaProvider extends BaseProvider {
  async connect(config: ProviderConfig): Promise<void> {
    this.config = { ...config, endpoint: config.endpoint || 'http://localhost:11434' };
  }

  async listModels(): Promise<string[]> {
    const cfg = this.assertConfig();
    const response = await fetch(`${cfg.endpoint}/api/tags`);
    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { models: Array<{ name: string }> };
    return data.models.map((model) => model.name);
  }

  async send(request: LLMRequest): Promise<LLMResponse> {
    const cfg = this.assertConfig();
    const ctrl = this.newAbortController();

    const response = await fetch(`${cfg.endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages.map((message) => ({ role: message.role, content: message.content })),
        stream: false,
        options: { temperature: request.temperature, num_predict: request.maxTokens },
      }),
      signal: ctrl.signal,
    });

    if (!response.ok) {
      const body = await this.parseErrorResponse(response);
      throw LLMError.fromStatus(response.status, body);
    }

    const data = (await response.json()) as {
      message: { content: string };
      model: string;
      done_reason?: string;
      prompt_eval_count?: number;
      eval_count?: number;
    };

    return {
      content: data.message.content,
      model: data.model,
      usage: {
        inputTokens: data.prompt_eval_count ?? 0,
        outputTokens: data.eval_count ?? 0,
        totalTokens: (data.prompt_eval_count ?? 0) + (data.eval_count ?? 0),
      },
      finishReason: data.done_reason ?? 'stop',
    };
  }

  async *stream(request: LLMRequest): AsyncIterable<LLMStreamChunk> {
    const cfg = this.assertConfig();
    const ctrl = this.newAbortController();

    const response = await fetch(`${cfg.endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages.map((message) => ({ role: message.role, content: message.content })),
        stream: true,
        options: { temperature: request.temperature, num_predict: request.maxTokens },
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
          if (!line.trim()) {
            continue;
          }

          try {
            const event = JSON.parse(line) as { message: { content: string }; done: boolean };
            yield { delta: event.message.content, done: event.done };
            if (event.done) {
              return;
            }
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
      const response = await fetch(`${cfg.endpoint}/api/tags`, { signal: AbortSignal.timeout(3000) });
      return response.ok;
    } catch {
      return false;
    }
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
