import { ParsedDate } from '../types.js';

export function isDateEqual(a: ParsedDate, b: ParsedDate): boolean {
  // skip second check
  const props: (keyof ParsedDate)[] = [
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'ampm'
  ];
  return props.every(prop => a[prop] === b[prop]);
}
