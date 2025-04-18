import { androidScreenshotParser } from '../parser/android-screenshot-parser.js';
import { basicParser } from '../parser/basic-parser.js';
import { dateParser } from '../parser/date-parser.js';
import { screenshotParser } from '../parser/screenshot-parser.js';
import { steamScreenshotParser } from '../parser/steam-screenshot-parser.js';
import { AutoDatetime, InternalParser, NormalizedDate } from '../types.js';
import { normalizeDate } from '../utils/normalize-date.js';

const internalParsers: InternalParser[] = [
  basicParser,
  androidScreenshotParser,
  screenshotParser,
  steamScreenshotParser,
  dateParser
];

export const parsers: AutoDatetime['parsers'] = Object.create(null);
for (const parser of internalParsers) parsers[parser.name] = parser;

export async function parse(
  fileName: string
): Promise<NormalizedDate | undefined> {
  for (const p of Object.values(parsers)) {
    const parsed = await p.parse(fileName);
    if (parsed) return normalizeDate(parsed);
  }
}
