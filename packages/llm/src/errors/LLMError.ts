export enum LLMErrorCode {
  AuthenticationFailed = 'AuthenticationFailed',
  RateLimited = 'RateLimited',
  ModelNotFound = 'ModelNotFound',
  RequestTooLarge = 'RequestTooLarge',
  NetworkError = 'NetworkError',
  StreamAborted = 'StreamAborted',
  InvalidResponse = 'InvalidResponse',
}

export class LLMError extends Error {
  readonly code: LLMErrorCode;
  readonly statusCode?: number;

  constructor(code: LLMErrorCode, message: string, statusCode?: number) {
    super(message);
    this.name = 'LLMError';
    this.code = code;
    this.statusCode = statusCode;
  }

  static fromStatus(status: number, body: string): LLMError {
    switch (status) {
      case 401:
        return new LLMError(LLMErrorCode.AuthenticationFailed, `Authentication failed: ${body}`, status);
      case 429:
        return new LLMError(LLMErrorCode.RateLimited, `Rate limited: ${body}`, status);
      case 404:
        return new LLMError(LLMErrorCode.ModelNotFound, `Model not found: ${body}`, status);
      case 413:
        return new LLMError(LLMErrorCode.RequestTooLarge, `Request too large: ${body}`, status);
      default:
        return new LLMError(LLMErrorCode.NetworkError, `HTTP ${status}: ${body}`, status);
    }
  }
}
