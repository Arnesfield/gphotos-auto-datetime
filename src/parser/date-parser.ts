import { parseDate } from '../date/parse-date';
import { Parser } from './parser.types';

/** Format: Any valid date string for the `Date()` constructor. */
export const dateParser: Parser = {
  name: 'date',
  parse(fileName) {
    return parseDate(new Date(fileName));
  }
};
