import { parse } from '../core/parsers.js';
import { NormalizedDate } from '../date/date.types.js';
import { isNormalizedDate } from '../date/is-normalized-date.js';
import { normalizeDate } from '../date/normalize-date.js';
import { parseDate } from '../date/parse-date.js';
import { getPhotoInfo, PhotoInfo } from './photo-info.js';

export function parseInput(
  value: Date | NormalizedDate | string | undefined,
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
