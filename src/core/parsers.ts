import { androidScreenshotParser } from '../parser/android-screenshot-parser.js';
import { basicParser } from '../parser/basic-parser.js';
import { dateParser } from '../parser/date-parser.js';
import { Parser } from '../parser/parser.types.js';
import { screenshotParser } from '../parser/screenshot-parser.js';
import { steamScreenshotParser } from '../parser/steam-screenshot-parser.js';
import { NormalizedDate } from '../types/date.types.js';
import { normalizeDate } from '../utils/normalize-date.js';

export const parsers: Parser[] = [
  basicParser,
  androidScreenshotParser,
  screenshotParser,
  steamScreenshotParser,
  dateParser
];

export function parse(value: string): NormalizedDate | undefined {
  for (const parser of parsers) {
    const date =
      typeof parser === 'function' ? parser(value) : parser.parse(value);
    if (date) return normalizeDate(date);
  }
}
