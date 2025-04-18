import { NAME } from '../constants.js';
import { instance } from './instance.js';

export async function init(): Promise<void> {
  // stop existing instance if any
  const adt = window[NAME];
  if (adt && typeof adt === 'object' && typeof adt.stop === 'function') {
    await adt.stop();
  }

  // start auto datetime
  instance.start();
}
