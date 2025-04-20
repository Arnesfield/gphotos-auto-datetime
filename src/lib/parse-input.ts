import { NormalizedDate } from '../date/date.types';
import { isNormalizedDate } from '../date/is-normalized-date';
import { normalizeDate } from '../date/normalize-date';
import { parseDate } from '../date/parse-date';
import { parse } from '../parser/parse';
import { getPhotoInfo, PhotoInfo } from './photo-info';

export function parseInput(
  value: Date | NormalizedDate | string | unknown | undefined,
  info?: PhotoInfo
): NormalizedDate | undefined {
  if (value == null) {
    info ||= getPhotoInfo();
    return info && parse(info.name);
  }
  if (typeof value === 'string') return parse(value);
  if (value instanceof Date) {
    const date = parseDate(value);
    return date && normalizeDate(date);
  }
  if (isNormalizedDate(value)) return value;
}
