export enum ParseErrorCode {
  InvalidJson = 'InvalidJson',
  InvalidSchema = 'InvalidSchema',
  UnsupportedFormat = 'UnsupportedFormat',
  MissingRootProperty = 'MissingRootProperty',
  UnknownEntity = 'UnknownEntity',
  InvalidCoordinates = 'InvalidCoordinates',
  DuplicateId = 'DuplicateId',
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
