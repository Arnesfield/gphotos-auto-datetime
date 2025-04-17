import { AmPm, NormalizedDate } from '../types.js';
import { cleanWhitespace } from '../utils/clean-whitespace.js';
import { padTime } from '../utils/pad-time.js';

export function parseDisplayDate(datetimeDiv: HTMLDivElement): NormalizedDate {
  const [monthDayOptionalYear, dotwAndTime] = Array.from(
    datetimeDiv.querySelectorAll('dd [aria-label]')
  )
    .slice(0, 2)
    .map(el => el.textContent || '');

  // {month name} {day}, {year}
  const dateString = monthDayOptionalYear.includes(',')
    ? monthDayOptionalYear
    : monthDayOptionalYear + ', ' + new Date().getFullYear();

  const time = cleanWhitespace(dotwAndTime).split(', ')[1];
  const [mss, ampm] = time.split(' ') as [string, AmPm];

  const date = new Date(dateString);
  const month = padTime(date.getMonth() + 1);
  const day = padTime(date.getDate());
  const year = date.getFullYear().toString();

  const [hourNoPadding, minute] = mss.split(':');
  const hour = padTime(hourNoPadding);

  return { year, month, day, hour, minute, second: '00', ampm };
}
