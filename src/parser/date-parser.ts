import { AmPm } from '../date/date.types.js';
import { InternalParser } from './parser.types.js';

const regexp = /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2}) (\w{2})/;

export const dateParser: InternalParser = {
  name: 'date',
  formats: ['Any valid date string for the Date() constructor'],
  parse(fileName) {
    const date = new Date(fileName);
    if (isNaN(+date)) return;

    const match = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
      .format(date)
      .match(regexp);
    if (match?.length === 8) {
      const [, month, day, year, hour12, minute, second, ampm] = match as [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        AmPm
      ];
      return { year, month, day, hour12, minute, second, ampm };
    }
  }
};
