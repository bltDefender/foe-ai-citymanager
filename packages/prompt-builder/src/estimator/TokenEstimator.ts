export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export interface ModelCost {
  readonly inputPer1k: number;
  readonly outputPer1k: number;
}

export interface CostEstimate {
  readonly input: number;
  readonly output: number;
  readonly total: number;
}

export const MODEL_PRICING: Record<string, ModelCost> = {
  'gpt-4o': { inputPer1k: 0.005, outputPer1k: 0.015 },
  'gpt-4o-mini': { inputPer1k: 0.00015, outputPer1k: 0.0006 },
  'gpt-4-turbo': { inputPer1k: 0.01, outputPer1k: 0.03 },
  'gpt-3.5-turbo': { inputPer1k: 0.0005, outputPer1k: 0.0015 },
  'claude-opus-4-5': { inputPer1k: 0.015, outputPer1k: 0.075 },
  'claude-sonnet-4-5': { inputPer1k: 0.003, outputPer1k: 0.015 },
  'claude-haiku-3-5': { inputPer1k: 0.00025, outputPer1k: 0.00125 },
  'gemini-1.5-pro': { inputPer1k: 0.0035, outputPer1k: 0.0105 },
  'gemini-1.5-flash': { inputPer1k: 0.000075, outputPer1k: 0.0003 },
};

export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: string,
): CostEstimate {
  const pricing = MODEL_PRICING[model] ?? { inputPer1k: 0.005, outputPer1k: 0.015 };
  const input = (inputTokens / 1000) * pricing.inputPer1k;
  const output = (outputTokens / 1000) * pricing.outputPer1k;
  return { input, output, total: input + output };
}
