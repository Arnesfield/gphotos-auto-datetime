import { NAME } from './constants.js';

export type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;

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

export interface Parser {
  name?: string;
  parse(fileName: string): MaybePromise<ParsedDate | void>;
}

export interface InternalParser extends Parser {
  name: string;
  /** For display purposes only. */
  formats: string[];
}

export interface Result {
  success: number;
  skipped: number;
}

export interface AutoDatetime {
  parsers: Parser[];
  next(): void;
  previous(): void;
  parse(value: string): Promise<NormalizedDate | undefined>;
  input(value: string | NormalizedDate): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void> | undefined;
  status(): void;
}

declare global {
  interface Window {
    [NAME]: AutoDatetime | undefined;
  }
}
