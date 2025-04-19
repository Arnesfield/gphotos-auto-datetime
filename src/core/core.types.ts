import { NormalizedDate } from '../date/date.types';

export interface Result {
  success: number;
  skipped: number;
}

export interface Meta {
  name: string;
  version: string;
}

export type ParserFunction = (name: string) => NormalizedDate | undefined;

export interface AutoDatetime {
  meta: Meta;
  info(): { name: string; date: NormalizedDate | undefined } | undefined;
  next(): void;
  previous(): void;
  parse(value?: string | Date | NormalizedDate): NormalizedDate | undefined;
  input(value?: string | Date | NormalizedDate): Promise<void>;
  start(parser?: ParserFunction): Promise<void>;
  stop(): Promise<void> | undefined;
  status(): void;
}
