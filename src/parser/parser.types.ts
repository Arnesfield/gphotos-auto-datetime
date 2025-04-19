import { ParsedDate } from '../date/date.types';

export interface Parser {
  name?: string;
  parse(fileName: string): ParsedDate | void;
}
