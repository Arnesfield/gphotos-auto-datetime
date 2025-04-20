import { parseDate } from '../date/parse-date';
import { Parser } from './parser.types';

const regexp = /\d{1,2} \w+ \d{4} \d{2}∶\d{2}∶\d{2}/;

/** Format: `d MMMM yyyy hh∶mm∶ss` */
export const nautilusDateParser: Parser = {
  name: 'nautilus-date',
  parse(fileName) {
    const match = fileName.match(regexp);
    if (match) {
      const date = match[0].replace(/∶/g, ':');
      return parseDate(new Date(date));
    }
  }
};
