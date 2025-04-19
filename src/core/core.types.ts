import { NormalizedDate } from '../date/date.types';
import { Parser } from '../parser/parser.types';

export interface Result {
  success: number;
  skipped: number;
}

export interface Meta {
  name: string;
  version: string;
}

export interface AutoDatetime {
  meta: Meta;
  parsers: Parser[];
  next(): void;
  previous(): void;
  parse(value?: string | Date | NormalizedDate): NormalizedDate | undefined;
  input(value?: string | Date | NormalizedDate): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void> | undefined;
  status(): void;
}
