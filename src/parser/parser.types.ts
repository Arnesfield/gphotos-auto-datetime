import { ParsedDate } from '../date/date.types.js';

export interface ParserObject {
  name?: string;
  parse(fileName: string): ParsedDate | void;
}

export type ParserFunction = ParserObject['parse'];

export type Parser = ParserObject | ParserFunction;

export interface InternalParser extends ParserObject {
  name: string;
  /** For display purposes only. */
  formats: string[];
}
