import { parseFileName } from '../utils/parse-file-name.js';
import { InternalParser } from './parser.types.js';

export const screenshotParser: InternalParser = {
  name: 'screenshot',
  formats: ['Screenshot from yyyy-MM-dd hh-mm-ss[-NTH].ext'],
  parse(fileName) {
    // gnome screenshots
    const prefix = 'Screenshot from ';
    if (fileName.startsWith(prefix)) {
      const name = parseFileName(fileName, prefix.length, prefix.length + 1);
      const [date, time] = name.split(' ');
      const [year, month, day] = date.split('-');
      const [hour24, minute, second] = time.split('-');
      return { year, month, day, hour24, minute, second };
    }
  }
};
