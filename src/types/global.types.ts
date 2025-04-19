import { NAME } from '../constants';
import { AutoDatetime } from '../core/core.types';

declare global {
  interface Window {
    [NAME]: AutoDatetime | undefined;
  }
}
