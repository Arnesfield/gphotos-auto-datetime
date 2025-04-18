import { AmPm, NormalizedDate } from '../types/date.types.js';
import { cleanWhitespace } from '../utils/clean-whitespace.js';
import { isElementVisible } from '../utils/is-element-visible.js';
import { padTime } from '../utils/pad-time.js';

const dateTakenSelector = 'dd [aria-label^="Date taken:"]';

export interface PhotoInfo {
  name: string;
  dlEl: HTMLDListElement;
  dateDetailsEl: HTMLElement;
}

export function parseInfoDate(info: PhotoInfo): NormalizedDate | undefined {
  // always query elements to ensure updated values
  const dateTakenEl = info.dlEl?.querySelector(dateTakenSelector);
  const timeTakenEl = info.dlEl?.querySelector(
    'dd [aria-label^="Time taken:"]'
  );

  /** Format: `MMM d[, yyyy]` */
  const dateTaken = dateTakenEl?.textContent;
  /** Format: `h:mm A` */
  const timeTaken = timeTakenEl?.textContent;

  if (!dateTaken || !timeTaken) return;

  const dateString = dateTaken.includes(',')
    ? dateTaken
    : dateTaken + ', ' + new Date().getFullYear();

  const time = cleanWhitespace(timeTaken).split(', ')[1];
  const [mss, ampm] = time.split(' ') as [string, AmPm];

  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = padTime(date.getMonth() + 1);
  const day = padTime(date.getDate());

  const [hourNoPadding, minute] = mss.split(':');
  const hour = padTime(hourNoPadding);

  return { year, month, day, hour, minute, second: '00', ampm };
}

export function getPhotoInfo(): PhotoInfo | undefined {
  // get active 'dl' sidebar element
  const dlEl = Array.from(document.querySelectorAll('dl')).find(
    isElementVisible
  );

  // NOTE: next sibling of timeTakenEl is the time zone element
  const fileNameEl = dlEl?.querySelector('dd [aria-label^="Filename:"]');
  const dateDetailsEl = dlEl?.querySelector('dd [aria-label^="Date taken:"]')
    ?.parentElement?.parentElement as HTMLElement | undefined;

  const name = fileNameEl?.textContent;

  if (name && dlEl && dateDetailsEl) {
    return { name, dlEl, dateDetailsEl };
  }
}
