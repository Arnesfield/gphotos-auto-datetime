import { Parser } from '../types.js';
import { parseFileName } from '../utils/parse-file-name.js';
import { createSlicer } from '../utils/slicer.js';

/** Format: `YYYYMMDD_HHMMSS.ext` */
export const basicParser = {
  name: 'basic',
  parse(fileName) {
    const file = parseFileName(fileName);
    const parts = file.name.split('_');
    const [date, time] = parts;

    // assume year is 4 length! :D
    if (
      parts.length === 2 &&
      date.length === 4 + 2 + 2 &&
      time.length === 2 + 2 + 2 &&
      isFinite(Number(date)) &&
      isFinite(Number(time))
    ) {
      let slicer = createSlicer(date);
      const year = slicer.slice(4);
      const month = slicer.slice(2);
      const day = slicer.slice(2);

      slicer = createSlicer(time);
      const hour24 = slicer.slice(2);
      const minute = slicer.slice(2);
      const second = slicer.slice(2);

      return { year, month, day, hour24, minute, second };
    }
  }
} satisfies Parser;
