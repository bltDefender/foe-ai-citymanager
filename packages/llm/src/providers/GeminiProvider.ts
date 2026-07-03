import { BaseProvider } from './BaseProvider.js';
import type {
  LLMRequest,
  LLMResponse,
  LLMStreamChunk,
  ProviderCapabilities,
  ProviderConfig,
} from '../types/index.js';
import { LLMError, LLMErrorCode } from '../errors/LLMError.js';

export class GeminiProvider extends BaseProvider {
  async connect(config: ProviderConfig): Promise<void> {
    this.config = config;
  }

  async listModels(): Promise<string[]> {
    return ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'];
  }

  private buildContents(request: LLMRequest): unknown[] {
    return request.messages
      .filter((message) => message.role !== 'system')
      .map((message) => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }],
      }));
  }

  private getSystemInstruction(request: LLMRequest): string | undefined {
    return request.systemPrompt ?? request.messages.find((message) => message.role === 'system')?.content;
  }

  async send(request: LLMRequest): Promise<LLMResponse> {
    const cfg = this.assertConfig();
    const ctrl = this.newAbortController();
    const url = `${cfg.endpoint}/v1beta/models/${request.model}:generateContent?key=${cfg.apiKey ?? ''}`;

    const body: Record<string, unknown> = {
      contents: this.buildContents(request),
      generationConfig: {
        temperature: request.temperature,
        maxOutputTokens: request.maxTokens,
      },
    };

    const systemInstruction = this.getSystemInstruction(request);
    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });

    if (!response.ok) {
      const bodyText = await this.parseErrorResponse(response);
      throw LLMError.fromStatus(response.status, bodyText);
    }

    const data = (await response.json()) as {
      candidates: Array<{ content: { parts: Array<{ text: string }> }; finishReason: string }>;
      usageMetadata: { promptTokenCount: number; candidatesTokenCount: number; totalTokenCount: number };
      modelVersion?: string;
    };

    const candidate = data.candidates[0];
    if (!candidate) {
      throw new LLMError(LLMErrorCode.InvalidResponse, 'No candidates in response');
    }

    const text = candidate.content.parts.map((part) => part.text).join('');

    return {
      content: text,
      model: data.modelVersion ?? request.model,
      usage: {
        inputTokens: data.usageMetadata.promptTokenCount,
        outputTokens: data.usageMetadata.candidatesTokenCount,
        totalTokens: data.usageMetadata.totalTokenCount,
      },
      finishReason: candidate.finishReason,
    };
  }

  async *stream(request: LLMRequest): AsyncIterable<LLMStreamChunk> {
    const cfg = this.assertConfig();
    const ctrl = this.newAbortController();
    const url = `${cfg.endpoint}/v1beta/models/${request.model}:streamGenerateContent?alt=sse&key=${cfg.apiKey ?? ''}`;

    const body: Record<string, unknown> = {
      contents: this.buildContents(request),
      generationConfig: { temperature: request.temperature, maxOutputTokens: request.maxTokens },
    };

    const systemInstruction = this.getSystemInstruction(request);
    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
          yield { delta: '', done: true };
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

          try {
            const event = JSON.parse(trimmed.slice(6)) as {
              candidates: Array<{ content: { parts: Array<{ text: string }> }; finishReason?: string }>;
            };
            const candidate = event.candidates[0];
            if (!candidate) {
              continue;
            }

            const delta = candidate.content.parts.map((part) => part.text).join('');
            const isDone = candidate.finishReason !== undefined && candidate.finishReason !== '';
            yield { delta, done: isDone };
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
      const response = await fetch(`${cfg.endpoint}/v1beta/models?key=${cfg.apiKey ?? ''}`, {
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
      maxContextTokens: 1000000,
      supportedModels: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    };
  }
}
