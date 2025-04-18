import { NormalizedDate } from './date.types.js';

export function isDateEqual(a: NormalizedDate, b: NormalizedDate): boolean {
  // skip second check
  const props: (keyof NormalizedDate)[] = [
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'ampm'
  ];
  return props.every(prop => a[prop] === b[prop]);
}
