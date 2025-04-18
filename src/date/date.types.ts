export type AmPm = 'AM' | 'PM';

export interface BaseDate {
  year: string;
  month: string;
  day: string;
  minute: string;
  second: string;
}

export interface ParsedDateHour12 extends BaseDate {
  hour12: string;
  hour24?: never;
  ampm: AmPm;
}

export interface ParsedDateHour24 extends BaseDate {
  hour12?: never;
  hour24: string;
  ampm?: never;
}

export type ParsedDate = ParsedDateHour12 | ParsedDateHour24;

export interface NormalizedDate extends BaseDate {
  hour: string;
  ampm: AmPm;
}
