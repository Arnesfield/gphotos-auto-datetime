import { parseFileName } from '../utils/parse-file-name.js';
import { InternalParser } from './parser.types.js';

export const screenshotParser: InternalParser = {
  name: 'screenshot',
  formats: ['Screenshot from yyyy-MM-dd hh-mm-ss[-NTH].ext'],
  parse(fileName) {
    const prefix = 'Screenshot from ';
    const index = fileName.indexOf(prefix);
    if (index > -1) {
      const start = index + prefix.length;
      const name = parseFileName(fileName, start, start + 1);
      const [date, time] = name.split(' ');
      const [year, month, day] = date.split('-');
      const [hour24, minute, second] = time.split('-');
      return { year, month, day, hour24, minute, second };
    }
  }
};
