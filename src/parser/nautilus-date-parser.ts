import { zeroPad } from '../utils/zero-pad';
import { ParserObject } from './parser.types';

const regexp = /(\d{1,2}) (\w+) (\d{4}) (\d{2})∶(\d{2})∶(\d{2})/;

/** Format: `d MMMM yyyy hh∶mm∶ss` */
export const nautilusDateParser: ParserObject = {
  name: 'nautilus-date',
  parse(fileName) {
    const match = fileName.match(regexp);
    if (!match || match.length !== 7) return;

    const [, dayValue, monthName, year, hour24, minute, second] = match;
    const date = new Date(`${monthName} ${dayValue} ${year}`);
    if (!isNaN(+date)) {
      const month = zeroPad(date.getMonth() + 1);
      const day = zeroPad(dayValue);
      return { year, month, day, hour24, minute, second };
    }
  }
};
