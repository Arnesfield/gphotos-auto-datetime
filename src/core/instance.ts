import { ID, NAME } from '../constants.js';
import { AutoDatetime } from '../types.js';
import { delay } from '../utils/delay.js';
import { isDateEqual } from '../utils/is-date-equal.js';
import { isElementVisible } from '../utils/is-element-visible.js';
import { inputDate } from './input-date.js';
import { parseDate } from './parse-date.js';
import { parseDisplayDate } from './parse-display-date.js';

let stop = false;
let running: Promise<void> | undefined;
const dryRun = false;
const single = false;

async function run() {
  console.log(
    '[%s] Starting %o. Enter %o to stop.',
    ID,
    NAME,
    `${NAME}.stop()`
  );

  const result = { success: 0, skipped: 0 };

  while (!stop) {
    await delay(400, 800);

    let retry = false;

    // get active 'dl' sidebar element
    const dl = Array.from(document.querySelectorAll('dl')).find(
      isElementVisible
    );
    const nameItemDiv = dl?.children[1];
    const nameDiv = nameItemDiv?.querySelector('dd > div');
    const name = nameDiv?.textContent;
    if (!name) {
      console.error('[%s] Unable to find the file name.', ID);
      break;
    }

    const parsedDate = parseDate(name);
    if (!parsedDate) {
      console.error('[%s] Unable to parse name: %o', ID, name);
      break;
    }

    const datetimeDiv = dl?.children[0]?.children[0] as
      | HTMLDivElement
      | null
      | undefined;
    if (!datetimeDiv) {
      console.error("[%s] Unable to find 'Date and time' details.", ID);
      break;
    }

    if (!isDateEqual(parsedDate, parseDisplayDate(datetimeDiv))) {
      datetimeDiv.click();

      // get dialog
      const dialogDiv = document.querySelector('div[data-back-to-cancel]');
      if (!dialogDiv) {
        console.error("[%s] Unable to find 'Edit Date & Time' dialog.", ID);
        break;
      }

      const dateInputs = dialogDiv.querySelectorAll<HTMLInputElement>('input');
      if (dateInputs.length !== 6) {
        console.error(
          "[%s] Unable to find 'Edit Date & Time' dialog fields.",
          ID
        );
        break;
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
          "[%s] Unable to find the 'Save' dialog action button.",
          ID
        );
        break;
      }

      if (!dryRun) {
        saveButtonEl.click();
        console.log(
          '[%s] Saved datetime for %o. Parsed: %o',
          ID,
          name,
          parsedDate
        );

        await delay(500, 1000);

        // verify if correct date
        const correct = isDateEqual(parsedDate, parseDisplayDate(datetimeDiv));
        if (correct) result.success++;

        // retry if not updated
        retry = !correct;
      } else {
        const cancelButtonEl = buttons[0];
        cancelButtonEl?.click();
        console.warn(
          '[%s] Dry run mode. Edit cancelled for %o. Parsed: %o',
          ID,
          name,
          parsedDate
        );
      }
    } else {
      console.log(
        '[%s] Photo %o already has the correct date and time. Skipping.',
        ID,
        name
      );
      result.skipped++;
      await delay(500, 1000);
    }

    // check single first so it gets removed when tree-shaken
    if (single || stop) break;

    if (retry) {
      console.warn(
        '[%s] Display date and time not updated for %o. Parsed: %o Display: %o',
        ID,
        name,
        parsedDate,
        parseDisplayDate(datetimeDiv)
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
      console.error("[%s] Unable to find the 'Next' photo button.", ID);
      break;
    }
    if (!isElementVisible(nextButtonDiv)) {
      console.warn(
        "[%s] The 'Next' photo button is not visible (end of photos).",
        ID
      );
      break;
    }

    // go to next image
    nextButtonDiv.click();
  }

  running = undefined;
  console.log(
    '[%s] %s. Enter %o to start again.\n' +
      '- Success: %o\n' +
      '- Skipped: %o\n' +
      '- Total: %o',
    ID,
    stop ? 'Stopped' : 'Done',
    `${NAME}.start()`,
    result.success,
    result.skipped,
    result.success + result.skipped
  );
}

export const instance: AutoDatetime = {
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
  }
};
