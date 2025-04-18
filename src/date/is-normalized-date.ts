import { NormalizedDate } from './date.types.js';

// @ts-expect-error use specific type for internal usage
export function isNormalizedDate(o: unknown): o is NormalizedDate;
export function isNormalizedDate(o: NormalizedDate): o is NormalizedDate {
  return (
    o &&
    typeof o === 'object' &&
    !Array.isArray(o) &&
    typeof o.year === 'string' &&
    typeof o.month === 'string' &&
    typeof o.day === 'string' &&
    typeof o.hour === 'string' &&
    typeof o.minute === 'string' &&
    typeof o.second === 'string' &&
    ['AM', 'PM'].includes(o.ampm)
  );
}
