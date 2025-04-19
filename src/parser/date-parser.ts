import { parseDate } from '../date/parse-date.js';
import { InternalParser } from './parser.types.js';

export const dateParser: InternalParser = {
  name: 'date',
  formats: ['Any valid date string for the Date() constructor'],
  parse(fileName) {
    return parseDate(new Date(fileName));
  }
};
