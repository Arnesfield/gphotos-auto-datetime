import { Parser } from '../types.js';
import { basicParser } from './basic-parser.js';

/**
 * Formats:
 * - `Screenshot_YYYYMMDD_HHMMSS_APPNAME.ext`
 * - `Screenshot_YYYYMMDD-HHMMSS_APPNAME.ext`
 */
export const androidScreenshotParser: Parser = {
  name: 'android-screenshot',
  parse(fileName) {
    const parts = fileName.split('_').flatMap((part, index, array) => {
      // split hyphen so date and time are separated parts
      return index === 1 && array.length === 3 ? part.split('-') : part;
    });

    if (parts.length === 4 && parts[0] === 'Screenshot') {
      return basicParser.parse(parts[1] + '_' + parts[2]);
    }
  }
};
