import { InternalParser } from '../types.js';
import { padTime } from '../utils/pad-time.js';

export const dateParser: InternalParser = {
  name: 'date',
  formats: [
    'dd MMMM yyyy hh∶mm∶ss.ext',
    'Any valid date string for the Date() constructor'
  ],
  parse(fileName) {
    const date = new Date(fileName.replace(/∶/g, ':'));
    if (!isNaN(+date)) {
      const year = date.getFullYear().toString();
      const month = padTime(date.getMonth() + 1);
      const day = padTime(date.getDate());
      const hour24 = padTime(date.getHours());
      const minute = padTime(date.getMinutes());
      const second = padTime(date.getSeconds());

      return { year, month, day, hour24, minute, second };
    }
  }
};
