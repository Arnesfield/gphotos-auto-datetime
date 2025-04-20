import { NormalizedDate } from '../date/date.types';
import { normalizeDate } from '../date/normalize-date';
import { dateParser } from './date-parser';
import { defaultParser } from './default-parser';
import { nautilusDateParser } from './nautilus-date-parser';
import { Parser } from './parser.types';

const parsers: Parser[] = [defaultParser, nautilusDateParser, dateParser];

export function parse(value: string): NormalizedDate | undefined {
  for (const parser of parsers) {
    const date = parser.parse(value);
    if (date) return normalizeDate(date);
  }
}
