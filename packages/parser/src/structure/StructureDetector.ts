import { ParseError, ParseErrorCode } from '../errors/ParseError.js';

export const ParserFormat = {
  FoeHelperCurrent: 'foe-helper-current',
} as const;

export type ParserFormat = (typeof ParserFormat)[keyof typeof ParserFormat];

const REQUIRED_PROPERTIES = ['CityMapData', 'CityEntities', 'UnlockedAreas'] as const;

export function detectStructure(root: Record<string, unknown>): ParserFormat {
  const presentProperties = REQUIRED_PROPERTIES.filter((property) => property in root);
  if (presentProperties.length === REQUIRED_PROPERTIES.length) {
    return ParserFormat.FoeHelperCurrent;
  }

  if (presentProperties.length > 0) {
    const missingProperties = REQUIRED_PROPERTIES.filter((property) => !(property in root));
    throw new ParseError(
      ParseErrorCode.MissingRootProperty,
      `Missing root properties: ${missingProperties.join(', ')}`,
      { missingProperties },
    );
  }

  throw new ParseError(
    ParseErrorCode.UnsupportedFormat,
    'Unsupported FoE export format',
    { requiredRootProperties: REQUIRED_PROPERTIES },
  );
}
