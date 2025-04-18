import { InternalParser } from '../types.js';
import { parseFileName } from '../utils/parse-file-name.js';

export const screenshotParser: InternalParser = {
  name: 'screenshot',
  formats: ['Screenshot from YYYY-MM-DD HH-MM-SS[-NTH].ext'],
  parse(fileName) {
    // gnome screenshots
    const prefix = 'Screenshot from ';
    if (fileName.startsWith(prefix)) {
      const file = parseFileName(fileName, prefix.length, prefix.length + 1);
      const [date, time] = file.name.split(' ');
      const [year, month, day] = date.split('-');
      const [hour24, minute, second] = time.split('-');
      return { year, month, day, hour24, minute, second };
    }
  }
};
