import { InternalParser } from './parser.types.js';

const regexps = [
  /(\d{4})(\d{2})(\d{2})[_-]?(\d{2})(\d{2})(\d{2})/,
  /(\d{4})-(\d{2})-(\d{2})[\s_](\d{2})-(\d{2})-(\d{2})/
];

export const defaultParser: InternalParser = {
  name: 'default',
  formats: [
    'yyyyMMdd_hhmmss',
    'yyyyMMdd-hhmmss',
    'yyyyMMddhhmmss',
    'yyyy-MM-dd hh-mm-ss',
    'yyyy-MM-dd_hh-mm-ss'
  ],
  parse(fileName) {
    for (const regexp of regexps) {
      const match = fileName.match(regexp);
      if (match?.length === 7) {
        const [, year, month, day, hour24, minute, second] = match;
        return { year, month, day, hour24, minute, second };
      }
    }
  }
};
