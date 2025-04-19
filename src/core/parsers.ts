import { NormalizedDate } from '../date/date.types.js';
import { normalizeDate } from '../date/normalize-date.js';
import { dateParser } from '../parser/date-parser.js';
import { defaultParser } from '../parser/default-parser.js';
import { nautilusDateParser } from '../parser/nautilus-date-parser.js';
import { Parser } from '../parser/parser.types.js';

export const parsers: Parser[] = [
  defaultParser,
  nautilusDateParser,
  dateParser
];

export function parse(value: string): NormalizedDate | undefined {
  for (const parser of parsers) {
    const date =
      typeof parser === 'function' ? parser(value) : parser.parse(value);
    if (date) return normalizeDate(date);
  }
}
