import { Parser } from '../parser/parser.types.js';
import { NormalizedDate } from '../types/date.types.js';

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
  parse(value?: string): NormalizedDate | undefined;
  input(value?: string | NormalizedDate): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void> | undefined;
  status(): void;
}
