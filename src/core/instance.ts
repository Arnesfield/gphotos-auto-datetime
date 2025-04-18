import { ID, NAME } from '../constants.js';
import { AutoDatetime, NormalizedDate } from '../types.js';
import { delay } from '../utils/delay.js';
import { isDateEqual } from '../utils/is-date-equal.js';
import { isElementVisible } from '../utils/is-element-visible.js';
import { normalizeDate } from '../utils/normalize-date.js';
import { inputDate } from './input-date.js';
import { parseDisplayDate } from './parse-display-date.js';
import { parsers } from './parsers.js';

let stop = false;
let running: Promise<void> | undefined;
let result = { success: 0, skipped: 0 };
const dryRun = false;
const single = false;

async function parseDate(
  fileName: string
): Promise<NormalizedDate | undefined> {
  if (!fileName) return;
  for (const parser of parsers) {
    const parsed = await parser.parse(fileName);
    if (parsed) return normalizeDate(parsed);
  }
}

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

async function run() {
  result = { success: 0, skipped: 0 };

  console.log(
    '[%s] Starting %o. Enter %o to stop and %o to check status.',
    ID,
    NAME,
    `${NAME}.stop()`,
    `${NAME}.status()`
  );

  for (let nth = 1; !stop; nth++) {
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
      console.error('[%s] [%o] Unable to find the file name.', ID, nth);
      break;
    }

    const parsedDate = await parseDate(name);
    if (!parsedDate) {
      console.error('[%s] [%o] Unable to parse name: %o', ID, nth, name);
      break;
    }

    const datetimeDiv = dl?.children[0]?.children[0] as
      | HTMLDivElement
      | null
      | undefined;
    if (!datetimeDiv) {
      console.error(
        "[%s] [%o] Unable to find 'Date and time' details.",
        ID,
        nth
      );
      break;
    }

    if (!isDateEqual(parsedDate, parseDisplayDate(datetimeDiv))) {
      datetimeDiv.click();

      // get dialog
      const dialogDiv = document.querySelector('div[data-back-to-cancel]');
      if (!dialogDiv) {
        console.error(
          "[%s] [%o] Unable to find 'Edit Date & Time' dialog.",
          ID,
          nth
        );
        break;
      }

      const dateInputs = dialogDiv.querySelectorAll<HTMLInputElement>('input');
      if (dateInputs.length !== 6) {
        console.error(
          "[%s] [%o] Unable to find 'Edit Date & Time' dialog fields.",
          ID,
          nth
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
          "[%s] [%o] Unable to find the 'Save' dialog action button.",
          ID,
          nth
        );
        break;
      }

      if (!dryRun) {
        saveButtonEl.click();
        console.log(
          '[%s] [%o] Saved datetime for %o. Parsed: %o',
          ID,
          nth,
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
          '[%s] [%o] Dry run mode. Edit cancelled for %o. Parsed: %o',
          ID,
          nth,
          name,
          parsedDate
        );
      }
    } else {
      console.log(
        '[%s] [%o] Photo %o already has the correct date and time. Skipping.',
        ID,
        nth,
        name
      );
      result.skipped++;
      await delay(500, 1000);
    }

    // check single first so it gets removed when tree-shaken
    if (single || stop) break;

    if (retry) {
      console.warn(
        '[%s] [%o] Display date and time not updated for %o. Parsed: %o Display: %o',
        ID,
        nth,
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
  }
};

Object.defineProperty(instance, 'parsers', {
  value: parsers,
  configurable: false,
  enumerable: true,
  writable: false
});
