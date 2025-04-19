import { padTime } from '../date/pad-time';
import { InternalParser } from './parser.types';

const regexp = /(\d{1,2}) (\w+) (\d{4}) (\d{2})∶(\d{2})∶(\d{2})/;

export const nautilusDateParser: InternalParser = {
  name: 'nautilus-date',
  formats: ['d MMMM yyyy hh∶mm∶ss'],
  parse(fileName) {
    const match = fileName.match(regexp);
    if (!match || match.length !== 7) return;

    const [, dayValue, monthName, year, hour24, minute, second] = match;
    const date = new Date(`${monthName} ${dayValue} ${year}`);
    if (!isNaN(+date)) {
      const month = padTime(date.getMonth() + 1);
      const day = padTime(dayValue);
      return { year, month, day, hour24, minute, second };
    }
  }
};
