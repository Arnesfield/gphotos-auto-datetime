import { androidScreenshotParser } from '../parser/android-screenshot-parser.js';
import { basicParser } from '../parser/basic-parser.js';
import { dateParser } from '../parser/date-parser.js';
import { screenshotParser } from '../parser/screenshot-parser.js';
import { steamScreenshotParser } from '../parser/steam-screenshot-parser.js';
import { NormalizedDate, Parser } from '../types.js';
import { normalizeDate } from '../utils/normalize-date.js';

export const parsers: Parser[] = [
  basicParser,
  androidScreenshotParser,
  screenshotParser,
  steamScreenshotParser,
  dateParser
];

export async function parse(
  value: string
): Promise<NormalizedDate | undefined> {
  for (const parser of parsers) {
    const parsed = await parser.parse(value);
    if (parsed) return normalizeDate(parsed);
  }
}
