import { NormalizedDate } from '../date/date.types';
import { normalizeDate } from '../date/normalize-date';
import { dateParser } from '../parser/date-parser';
import { defaultParser } from '../parser/default-parser';
import { nautilusDateParser } from '../parser/nautilus-date-parser';
import { Parser } from '../parser/parser.types';

const parsers: Parser[] = [defaultParser, nautilusDateParser, dateParser];

export function parse(value: string): NormalizedDate | undefined {
  for (const parser of parsers) {
    const date = parser.parse(value);
    if (date) return normalizeDate(date);
  }
}
