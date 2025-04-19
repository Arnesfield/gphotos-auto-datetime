import { parseDate } from '../date/parse-date.js';
import { ParserObject } from './parser.types.js';

/** Format: Any valid date string for the `Date()` constructor. */
export const dateParser: ParserObject = {
  name: 'date',
  parse(fileName) {
    return parseDate(new Date(fileName));
  }
};
