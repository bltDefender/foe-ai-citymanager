import type { City } from '@forgemind/core';

export interface IParser<TInput = unknown> {
  parse(input: TInput): City;
}
