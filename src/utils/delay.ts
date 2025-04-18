import { randomInt } from './random-int.js';

export function delay(min: number, max = min): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, randomInt(min, max)));
}
