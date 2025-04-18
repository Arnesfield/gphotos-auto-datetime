import { androidScreenshotParser } from '../parser/android-screenshot-parser.js';
import { basicParser } from '../parser/basic-parser.js';
import { screenshotParser } from '../parser/screenshot-parser.js';
import { steamScreenshotParser } from '../parser/steam-screenshot-parser.js';
import { NormalizedDate, Parser } from '../types.js';
import { normalizeDate } from '../utils/normalize-date.js';

export const parsers: Parser[] = [
  basicParser,
  androidScreenshotParser,
  screenshotParser,
  steamScreenshotParser
];

export async function parseDate(
  fileName: string
): Promise<NormalizedDate | undefined> {
  if (!fileName) return;
  for (const parser of parsers) {
    const parsed = await parser.parse(fileName);
    if (parsed) return normalizeDate(parsed);
  }
}
