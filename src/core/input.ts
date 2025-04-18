import { DRY_RUN } from '../constants.js';
import { inputDate } from '../lib/input-date.js';
import { Logger } from '../lib/logger.js';
import { parseInfoDate, PhotoInfo } from '../lib/photo-info.js';
import { NormalizedDate } from '../types/date.types.js';
import { delay } from '../utils/delay.js';
import { isDateEqual } from '../utils/is-date-equal.js';

export interface InputResult {
  success?: boolean;
  skipped?: boolean;
  break?: boolean;
  infoDate?: NormalizedDate;
}

export async function input(
  logger: Logger,
  info: PhotoInfo,
  parsedDate: NormalizedDate
): Promise<InputResult> {
  const res: InputResult = { break: true };

  const infoDate = parseInfoDate(info);
  if (!infoDate) {
    logger.error('Unable to parse date and time.');
    return res;
  }

  if (!isDateEqual(parsedDate, infoDate)) {
    info.dateDetailsEl.click();

    // get dialog
    const dialogDiv = document.querySelector('div[data-back-to-cancel]');
    if (!dialogDiv) {
      logger.error("Unable to find 'Edit Date & Time' dialog.");
      return res;
    }

    const dateInputs = dialogDiv.querySelectorAll<HTMLInputElement>('input');
    if (dateInputs.length !== 6) {
      logger.error("Unable to find 'Edit Date & Time' dialog fields.");
      return res;
    }

    await inputDate(parsedDate, dateInputs);
    await delay(200, 400);

    // get dialog buttons
    const buttons = Array.from(
      dialogDiv.querySelectorAll<HTMLButtonElement>('button')
    );
    const saveButtonEl = buttons[1];

    if (!saveButtonEl) {
      logger.error("Unable to find the 'Save' dialog action button.");
      return res;
    }

    if (!DRY_RUN) {
      saveButtonEl.click();
      logger.log(
        'Saved date and time for %o. Parsed: %o',
        info.name,
        parsedDate
      );

      await delay(1000, 1500);

      // verify if correct date
      res.infoDate = parseInfoDate(info);
      res.success = !!res.infoDate && isDateEqual(parsedDate, res.infoDate);
    } else {
      const cancelButtonEl = buttons[0];
      cancelButtonEl?.click();
      logger.warn(
        'Dry run mode. Edit cancelled for %o. Parsed: %o',
        info.name,
        parsedDate
      );
    }
  } else {
    logger.log(
      'Photo %o already has the correct date and time. Skipping.',
      info.name
    );
    res.skipped = true;
  }

  res.break = false;
  return res;
}
