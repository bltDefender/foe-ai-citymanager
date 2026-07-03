export enum AnalyzerErrorCode {
  InvalidCity = 'InvalidCity',
  ComputationFailed = 'ComputationFailed',
  GraphBuildFailed = 'GraphBuildFailed',
}

export class AnalyzerError extends Error {
  readonly code: AnalyzerErrorCode;
  readonly context: Record<string, unknown>;

  constructor(code: AnalyzerErrorCode, message: string, context: Record<string, unknown> = {}) {
    super(message);
    this.name = 'AnalyzerError';
    this.code = code;
    this.context = context;
  }
}
