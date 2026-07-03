export enum ParseErrorCode {
  InvalidJson = 'InvalidJson',
  InvalidSchema = 'InvalidSchema',
  UnknownVersion = 'UnknownVersion',
  MissingField = 'MissingField',
  InvalidValue = 'InvalidValue',
}

export class ParseError extends Error {
  readonly code: ParseErrorCode;
  readonly context: Record<string, unknown>;

  constructor(code: ParseErrorCode, message: string, context: Record<string, unknown> = {}) {
    super(message);
    this.name = 'ParseError';
    this.code = code;
    this.context = context;
  }
}
