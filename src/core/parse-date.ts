import { NormalizeDateOptions, ParsedDate } from '../types.js';
import { padTime } from '../utils/pad-time.js';

function parseHour(hour24: number) {
  if (hour24 >= 0 && hour24 <= 23) {
    const hour =
      hour24 === 0 || hour24 === 12 ? 12 : hour24 - (hour24 < 12 ? 0 : 12);
    return { hour: padTime(hour), ampm: hour24 < 12 ? 'AM' : 'PM' };
  }
}

function normalizeDate(options: NormalizeDateOptions): ParsedDate | undefined {
  const parsedHour = parseHour(Number(options.hour24));
  if (parsedHour == null) return;

  const { hour, ampm } = parsedHour;
  const { year, month, day, minute, second } = options;
  return { year, month, day, hour, minute, second, ampm };
}

export function parseDate(name: string | undefined): ParsedDate | undefined {
  if (!name) return;

  let extensionIndex = name.indexOf('.');
  extensionIndex = extensionIndex > -1 ? extensionIndex : name.length;
  const fileName = name.slice(0, extensionIndex);

  // gnome screenshots
  const GNOME_NAME = 'Screenshot from ';
  if (fileName.startsWith(GNOME_NAME)) {
    /** Format: `YYYY-MM-DD HH-MM-SS-NTH` */
    const datetime = fileName.slice(GNOME_NAME.length, extensionIndex);
    const [date, time] = datetime.split(' ');
    const [year, month, day] = date.split('-');
    const [hour24, minute, second] = time.split('-');

    return normalizeDate({ year, month, day, hour24, minute, second });
  }

  // steam screenshots
  /** Format: `GAMEID_YYYYMMDDHHMMSS_NTH` */
  const parts = fileName.split('_');
  if (
    parts.length === 3 &&
    isFinite(Number(parts[0])) &&
    isFinite(Number(parts[1]))
  ) {
    let index = 0;
    const datetime = parts[1];
    const slice = (n: number) => datetime.slice(index, (index += n));

    const year = slice(4);
    const month = slice(2);
    const day = slice(2);
    const hour24 = slice(2);
    const minute = slice(2);
    const second = slice(2);

    return normalizeDate({ year, month, day, hour24, minute, second });
  }
}
