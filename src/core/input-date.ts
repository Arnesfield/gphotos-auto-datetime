import { NormalizedDate } from '../types.js';
import { delay } from '../utils/delay.js';

export async function inputDate(
  parsedDate: NormalizedDate,
  inputs: NodeListOf<HTMLInputElement>
): Promise<void> {
  // set data to fields
  // create value list to ensure correct order
  const valueList = [
    parsedDate.year,
    parsedDate.month,
    parsedDate.day,
    parsedDate.hour,
    parsedDate.minute
  ];

  const opts: EventInit = { bubbles: true, cancelable: false, composed: true };

  for (let index = 0; index < valueList.length; index++) {
    const inputEl = inputs[index];
    const value = valueList[index];

    // if value is the same, skip it
    if (inputEl.value === value) continue;

    await delay(50, 150);

    // mimic keyboard input
    // NOTE: taken from https://stackoverflow.com/a/69286377/7013346
    inputEl.click();
    await delay(10);
    inputEl.value = value;
    await delay(10);
    inputEl.dispatchEvent(new Event('input', opts));
    await delay(10);
    inputEl.dispatchEvent(new Event('blur', opts));

    await delay(50, 150);
  }

  // clicking on ampm field will change it
  const ampmInputEl = inputs[valueList.length];
  if (ampmInputEl.value !== parsedDate.ampm) {
    ampmInputEl.click();
    await delay(50, 150);
  }
}
