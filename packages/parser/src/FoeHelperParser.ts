import type { City } from '@forgemind/core';
import type { IParser } from './IParser.js';
import { ParseError, ParseErrorCode } from './errors/ParseError.js';
import { detectStructure, ParserFormat } from './structure/StructureDetector.js';
import { FoeHelperCurrentAdapter } from './foe-helper/FoeHelperCurrentAdapter.js';

export class FoeHelperParser implements IParser<string> {
  private readonly foeHelperCurrentAdapter = new FoeHelperCurrentAdapter();

  parse(jsonString: string): City {
    let data: unknown;
    try {
      data = JSON.parse(jsonString);
    } catch {
      throw new ParseError(ParseErrorCode.InvalidJson, 'Invalid JSON input');
    }

    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new ParseError(ParseErrorCode.InvalidSchema, 'Root must be an object');
    }

    const format = detectStructure(data as Record<string, unknown>);
    if (format === ParserFormat.FoeHelperCurrent) {
      return this.foeHelperCurrentAdapter.parse(data);
    }

    throw new ParseError(ParseErrorCode.UnsupportedFormat, `Unsupported format: ${String(format)}`);
  }
}
