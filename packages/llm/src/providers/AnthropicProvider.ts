import { BaseProvider } from './BaseProvider.js';
import type {
  LLMRequest,
  LLMResponse,
  LLMStreamChunk,
  ProviderCapabilities,
  ProviderConfig,
} from '../types/index.js';
import { LLMError, LLMErrorCode } from '../errors/LLMError.js';

export class AnthropicProvider extends BaseProvider {
  private static readonly API_VERSION = '2023-06-01';

  async connect(config: ProviderConfig): Promise<void> {
    this.config = config;
  }

  async listModels(): Promise<string[]> {
    return ['claude-opus-4-5', 'claude-sonnet-4-5', 'claude-haiku-3-5', 'claude-3-opus-20240229'];
  }

  async send(request: LLMRequest): Promise<LLMResponse> {
    const cfg = this.assertConfig();
    const ctrl = this.newAbortController();

    const userMessages = request.messages.filter((message) => message.role !== 'system');
    const systemPrompt = request.systemPrompt ?? request.messages.find((message) => message.role === 'system')?.content;

    const body: Record<string, unknown> = {
      model: request.model,
      max_tokens: request.maxTokens,
      messages: userMessages.map((message) => ({ role: message.role, content: message.content })),
    };
    if (systemPrompt) {
      body.system = systemPrompt;
    }

    const response = await fetch(`${cfg.endpoint}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': cfg.apiKey ?? '',
        'anthropic-version': AnthropicProvider.API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });

    if (!response.ok) {
      const bodyText = await this.parseErrorResponse(response);
      throw LLMError.fromStatus(response.status, bodyText);
    }

    const data = (await response.json()) as {
      content: Array<{ type: string; text: string }>;
      model: string;
      stop_reason: string;
      usage: { input_tokens: number; output_tokens: number };
    };

    const text = data.content.filter((block) => block.type === 'text').map((block) => block.text).join('');
    return {
      content: text,
      model: data.model,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
      finishReason: data.stop_reason,
    };
  }

  async *stream(request: LLMRequest): AsyncIterable<LLMStreamChunk> {
    const cfg = this.assertConfig();
    const ctrl = this.newAbortController();

    const userMessages = request.messages.filter((message) => message.role !== 'system');
    const systemPrompt = request.systemPrompt ?? request.messages.find((message) => message.role === 'system')?.content;

    const body: Record<string, unknown> = {
      model: request.model,
      max_tokens: request.maxTokens,
      messages: userMessages.map((message) => ({ role: message.role, content: message.content })),
      stream: true,
    };
    if (systemPrompt) {
      body.system = systemPrompt;
    }

    const response = await fetch(`${cfg.endpoint}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': cfg.apiKey ?? '',
        'anthropic-version': AnthropicProvider.API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });

    if (!response.ok) {
      const bodyText = await this.parseErrorResponse(response);
      throw LLMError.fromStatus(response.status, bodyText);
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
          try {
            const event = JSON.parse(json) as { type: string; delta?: { type: string; text?: string } };
            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              yield { delta: event.delta.text ?? '', done: false };
            } else if (event.type === 'message_stop') {
              yield { delta: '', done: true };
              return;
            }
          } catch {
            // Skip malformed
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
      const response = await fetch(`${cfg.endpoint}/v1/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': cfg.apiKey ?? '',
          'anthropic-version': AnthropicProvider.API_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-3-5',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }],
        }),
        signal: AbortSignal.timeout(5000),
      });
      return response.status !== 401 && response.status !== 403;
    } catch {
      return false;
    }
  }

  getCapabilities(): ProviderCapabilities {
    return {
      supportsStreaming: true,
      supportsSystemPrompt: true,
      maxContextTokens: 200000,
      supportedModels: ['claude-opus-4-5', 'claude-sonnet-4-5', 'claude-haiku-3-5', 'claude-3-opus-20240229'],
    };
  }
}
