import { InternalParser } from '../types.js';
import { parseFileName } from '../utils/parse-file-name.js';
import { createSlicer } from '../utils/slicer.js';

export const basicParser: InternalParser = {
  name: 'basic',
  formats: ['yyyyMMdd_hhmmss[-NTH].ext'],
  parse(fileName) {
    const file = parseFileName(fileName);
    const parts = file.name.split('_');
    const [date, timeNth] = parts;

    let index;
    const time =
      timeNth && (index = timeNth.indexOf('-')) > -1
        ? timeNth.slice(0, index)
        : timeNth; // this can be undefined but parts.length is checked anyway

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
};
