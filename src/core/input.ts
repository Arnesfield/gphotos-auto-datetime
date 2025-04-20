import { DRY_RUN } from '../constants';
import { NormalizedDate } from '../date/date.types';
import { isDateEqual } from '../date/is-date-equal';
import { Logger } from '../lib/logger';
import { parseInfoDate, PhotoInfo } from '../lib/photo-info';
import { delay } from '../utils/delay';
import { inputDate } from './input-date';

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
    const buttons = dialogDiv.querySelectorAll<HTMLButtonElement>('button');
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
      await delay(200, 400);
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
