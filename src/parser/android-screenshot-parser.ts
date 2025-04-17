import { Parser } from '../types.js';
import { basicParser } from './basic-parser.js';

export const androidScreenshotParser: Parser = {
  name: 'android-screenshot',
  parse(fileName) {
    /**
     * Formats:
     * - `Screenshot_YYYYMMDD_HHMMSS_APPNAME.png`
     * - `Screenshot_YYYYMMDD-HHMMSS_APPNAME.png`
     */
    const parts = fileName.split('_').flatMap((part, index, array) => {
      return index === 1 && array.length === 3 ? part.split('-') : part;
    });

    if (!(parts.length === 4 && parts[0] === 'Screenshot')) {
      return;
    }

    return basicParser.parse(parts[1] + '_' + parts[2]);
  }
};
