import { androidScreenshotParser } from '../parser/android-screenshot-parser.js';
import { basicParser } from '../parser/basic-parser.js';
import { screenshotParser } from '../parser/screenshot-parser.js';
import { steamScreenshotParser } from '../parser/steam-screenshot-parser.js';
import { Parser } from '../types.js';

export const parsers: Parser[] = [
  basicParser,
  androidScreenshotParser,
  screenshotParser,
  steamScreenshotParser
];
