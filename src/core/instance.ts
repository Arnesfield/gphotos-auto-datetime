import { ID, NAME } from '../constants.js';
import { AutoDatetime, NormalizedDate } from '../types.js';
import { delay } from '../utils/delay.js';
import { isDateEqual } from '../utils/is-date-equal.js';
import { isElementVisible } from '../utils/is-element-visible.js';
import { normalizeDate } from '../utils/normalize-date.js';
import { inputDate } from './input-date.js';
import { parse, parsers } from './parsers.js';
import { getPhotoInfo, parseInfoDate, PhotoInfo } from './photo-info.js';

let stop = false;
let running: Promise<void> | undefined;
let result = { success: 0, skipped: 0 };
const dryRun = false;
const single = false;

function status(message: string, ...args: string[]) {
  console.log(
    `[%s] ${message}\n` + '- Success: %o\n' + '- Skipped: %o\n' + '- Total: %o',
    ID,
    ...args,
    result.success,
    result.skipped,
    result.success + result.skipped
  );
}

async function input(options: {
  nth: number;
  info: PhotoInfo;
  parsedDate: NormalizedDate;
}) {
  const { nth, info, parsedDate } = options;
  const res: {
    success?: boolean;
    skipped?: boolean;
    break?: boolean;
    infoDate?: NormalizedDate;
  } = { break: true };

  const infoDate = parseInfoDate(info);
  if (!infoDate) {
    console.error('[%s] [%o] Unable to parse date and time.', ID, nth);
    return res;
  }

  if (!isDateEqual(parsedDate, infoDate)) {
    info.dateDetailsEl.click();

    // get dialog
    const dialogDiv = document.querySelector('div[data-back-to-cancel]');
    if (!dialogDiv) {
      console.error(
        "[%s] [%o] Unable to find 'Edit Date & Time' dialog.",
        ID,
        nth
      );
      return res;
    }

    const dateInputs = dialogDiv.querySelectorAll<HTMLInputElement>('input');
    if (dateInputs.length !== 6) {
      console.error(
        "[%s] [%o] Unable to find 'Edit Date & Time' dialog fields.",
        ID,
        nth
      );
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
      console.error(
        "[%s] [%o] Unable to find the 'Save' dialog action button.",
        ID,
        nth
      );
      return res;
    }

    if (!dryRun) {
      saveButtonEl.click();
      console.log(
        '[%s] [%o] Saved datetime for %o. Parsed: %o',
        ID,
        nth,
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
      console.warn(
        '[%s] [%o] Dry run mode. Edit cancelled for %o. Parsed: %o',
        ID,
        nth,
        info.name,
        parsedDate
      );
    }
  } else {
    console.log(
      '[%s] [%o] Photo %o already has the correct date and time. Skipping.',
      ID,
      nth,
      info.name
    );
    res.skipped = true;
    await delay(500, 1000);
  }

  res.break = false;
  return res;
}

async function run() {
  result = { success: 0, skipped: 0 };
  let prevName: string | undefined;

  console.log(
    '[%s] Starting %o. Enter %o to stop and %o to check status.',
    ID,
    NAME,
    `${NAME}.stop()`,
    `${NAME}.status()`
  );

  for (let nth = 1; !stop; nth++) {
    await delay(500, 800);

    let retry = false;

    // get active 'dl' sidebar element
    const info = getPhotoInfo();
    if (!info) {
      console.error('[%s] [%o] Unable to find the file name.', ID, nth);
      break;
    }

    // somehow, the info panel was not updated yet
    if (prevName === info.name) continue;
    prevName = info.name;

    const parsedDate = await parse(info.name);
    if (!parsedDate) {
      console.error('[%s] [%o] Unable to parse name: %o', ID, nth, info.name);
      break;
    }

    const inputResult = await input({ nth, parsedDate, info });

    if (inputResult.success) result.success++;
    if (inputResult.skipped) result.skipped++;
    // retry if not updated
    if (inputResult.success != null) retry = !inputResult.success;

    // check single first so it gets removed when tree-shaken
    if (single || stop || inputResult.break) break;

    if (retry) {
      console.warn(
        '[%s] [%o] Photo date and time not updated for %o. Parsed: %o Details: %o',
        ID,
        nth,
        info.name,
        parsedDate,
        inputResult.infoDate
      );
      continue;
    }

    // get image content to get next arrow button
    const imageContainerEl = Array.from(
      document.querySelectorAll('c-wiz[data-media-key]')
    ).find(isElementVisible);
    const nextButtonDiv =
      imageContainerEl?.parentElement?.querySelector<HTMLDivElement>(
        'div[role=button][aria-label="View next photo"]'
      );

    if (!nextButtonDiv) {
      console.error(
        "[%s] [%o] Unable to find the 'Next' photo button.",
        ID,
        nth
      );
      break;
    }
    if (!isElementVisible(nextButtonDiv)) {
      console.warn(
        "[%s] [%o] The 'Next' photo button is not visible (end of photos).",
        ID,
        nth
      );
      break;
    }

    // go to next image
    nextButtonDiv.click();
  }

  running = undefined;

  status(
    '%s. Enter %o to start again.',
    stop ? 'Stopped' : 'Done',
    `${NAME}.start()`
  );
}

export const instance: AutoDatetime = {
  parsers,
  start() {
    if (!running) {
      stop = false;
      running = run();
    }
    return running;
  },
  stop() {
    stop = true;
    return running;
  },
  status() {
    status('Status: %o', running ? 'Running' : 'Not Running');
  },
  input(date) {
    const parsedDate = normalizeDate(date);
    if (!parsedDate) {
      console.error('[%s] Unable to normalize the date: %o', ID, date);
      return;
    }

    const info = getPhotoInfo();
    if (info) input({ parsedDate, nth: 0, info });
    else console.error('[%s] Unable to edit date and time.', ID);
  },
  parse
};
