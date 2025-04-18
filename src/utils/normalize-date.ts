import { AmPm, NormalizedDate, ParsedDate } from '../types.js';
import { padTime } from './pad-time.js';

interface ParsedHour {
  hour: number | string;
  ampm: AmPm;
}

function parseHour(hour: string | undefined, max: number) {
  const hr = hour ? Number(hour) : null;
  if (hr != null && hr >= 0 && hr < max) return hr;
}

export function normalizeDate(parsed: ParsedDate): NormalizedDate | undefined {
  // check if hour12 is valid
  let hr;
  const parsedHour: ParsedHour | null =
    parsed.hour12 && (hr = parseHour(parsed.hour12, 12)) != null
      ? { hour: hr, ampm: parsed.ampm || 'AM' }
      : (hr = parseHour(parsed.hour24, 24)) != null
        ? {
            hour: hr === 0 || hr === 12 ? 12 : hr - (hr < 12 ? 0 : 12),
            ampm: hr < 12 ? 'AM' : 'PM'
          }
        : null;
  if (!parsedHour) return;

  const { ampm } = parsedHour;
  const { year } = parsed;
  const month = padTime(parsed.month);
  const day = padTime(parsed.day);
  const hour = padTime(parsedHour.hour);
  const minute = padTime(parsed.minute);
  const second = padTime(parsed.second);

  return { year, month, day, hour, minute, second, ampm };
}
