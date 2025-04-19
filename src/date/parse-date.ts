import { AmPm, ParsedDate } from './date.types';

const regexp = /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2}) (AM|PM)/i;

export function parseDate(date: Date): ParsedDate | undefined {
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
    const [, month, day, year, hour12, minute, second, ampmValue] = match;
    const ampm = ampmValue.toUpperCase() as AmPm;
    return { year, month, day, hour12, minute, second, ampm };
  }
}
