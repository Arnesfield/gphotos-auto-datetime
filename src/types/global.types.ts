import { NAME } from '../constants.js';
import { AutoDatetime } from '../core/core.types.js';

declare global {
  interface Window {
    [NAME]: AutoDatetime | undefined;
  }
}
