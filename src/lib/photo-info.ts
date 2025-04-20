import { NormalizedDate } from '../date/date.types';
import { normalizeDate } from '../date/normalize-date';
import { parseDate } from '../date/parse-date';
import { findVisibleElement } from '../utils/element';

export interface PhotoInfo {
  name: string;
  dlEl: HTMLDListElement;
  dateDetailsEl: HTMLElement;
}

export function getPhotoInfo(): PhotoInfo | undefined {
  // get active 'dl' sidebar element
  const dlEl = findVisibleElement(document.querySelectorAll('dl'));

  // NOTE: next sibling of timeTakenEl is the time zone element
  const fileNameEl = dlEl?.querySelector('dd [aria-label^="Filename:"]');
  const dateDetailsEl = dlEl?.querySelector('dd [aria-label^="Date taken:"]')
    ?.parentElement?.parentElement as HTMLElement | undefined;

  const name = fileNameEl?.textContent;

  if (name && dlEl && dateDetailsEl) {
    return { name, dlEl, dateDetailsEl };
  }
}

export function parseInfoDate(info: PhotoInfo): NormalizedDate | undefined {
  // always query elements to ensure updated values
  const dateTakenEl = info.dlEl?.querySelector(
    'dd [aria-label^="Date taken:"]'
  );
  const timeTakenEl = info.dlEl?.querySelector(
    'dd [aria-label^="Time taken:"]'
  );

  /** Format: `MMM d[, yyyy]` */
  const dateTaken = dateTakenEl?.textContent;
  /** Format: `Mon|Today, h:mm A` */
  const timeTaken = timeTakenEl?.textContent;

  if (!dateTaken || !timeTaken) return;

  // add missing year
  const date = dateTaken.includes(',')
    ? dateTaken
    : dateTaken + ', ' + new Date().getFullYear();

  // clean whitespace
  const time = timeTaken.replace(/\s/g, ' ').split(', ')[1];

  const parsed = parseDate(new Date(`${date} ${time}`));
  return parsed && normalizeDate(parsed);
}
