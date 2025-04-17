import { NAME } from './constants.js';

export interface AutoDatetime {
  start(): Promise<void>;
  stop(): Promise<void> | undefined;
}

declare global {
  interface Window {
    [NAME]: AutoDatetime | undefined;
  }
}

export interface BaseDate {
  year: string;
  month: string;
  day: string;
  minute: string;
  second: string;
}

export interface NormalizeDateOptions extends BaseDate {
  hour24: string;
}

export interface ParsedDate extends BaseDate {
  hour: string;
  ampm: string;
}
