import { NAME } from '../constants.js';
import { Logger } from '../lib/logger.js';
import { getPhotoInfo } from '../lib/photo-info.js';
import { AutoDatetime, Result } from '../types.js';
import { delay } from '../utils/delay.js';
import { isNormalizedDate } from '../utils/is-normalized-date.js';
import { input } from './input.js';
import { next, previous } from './navigation.js';
import { parse, parsers } from './parsers.js';
import { summary } from './summary.js';

let stop = false;
let running: Promise<void> | undefined;
let result: Result = { success: 0, skipped: 0 };

async function run() {
  const MAX_RETRIES = 5;
  let nth = 1;
  let attempts = 0;
  let prevName: string | undefined;
  const logger = new Logger(() => nth);

  function retry() {
    return attempts++ < MAX_RETRIES;
  }

  while (!stop) {
    await delay(500, 1500);

    const info = getPhotoInfo();
    if (!info) {
      if (!retry()) {
        logger.error('Unable to find the file name.');
        break;
      }

      logger.warn(
        'Unable to find the file name. Retrying %o of %o.',
        attempts,
        MAX_RETRIES
      );
      continue;
    }

    // retry as the info panel was not updated yet for some reason
    if (prevName === info.name) {
      if (!retry()) {
        logger.error('File name %o did not change.', prevName);
        break;
      }

      logger.warn(
        'File name %o did not change. Retrying %o of %o.',
        prevName,
        attempts,
        MAX_RETRIES
      );
      continue;
    }

    prevName = info.name;
    const parsedDate = parse(info.name);
    if (!parsedDate) {
      logger.error('Unable to parse name: %o', info.name);
      break;
    }

    const inputResult = await input(logger, info, parsedDate);
    if (inputResult.success) result.success++;
    if (inputResult.skipped) result.skipped++;
    if (stop || inputResult.break) break;

    if (inputResult.success === false) {
      // retry if not updated
      logger.warn(
        'Photo date and time not updated for %o. Parsed: %o Details: %o',
        info.name,
        parsedDate,
        inputResult.infoDate
      );

      if (!retry()) break;
      continue;
    }

    if (!next(logger)) break;

    nth++;
    attempts = 0;
  }

  summary(
    logger,
    result,
    '%s. Enter %o to start again.',
    stop ? 'Stopped' : 'Done',
    `${NAME}.start()`
  );
}

const logger = new Logger();

export const instance: AutoDatetime = {
  parsers,
  next() {
    next(logger);
  },
  previous() {
    previous(logger);
  },
  parse(value) {
    if (!value) {
      const info = getPhotoInfo();
      if (!info) {
        logger.error('Unable to parse date and time info.');
        return;
      }
      value = info.name;
    }
    return parse(value);
  },
  async input(value) {
    const info = getPhotoInfo();
    if (!info) {
      logger.error('Unable to parse date and time info.');
      return;
    }

    const parsedDate =
      value == null
        ? parse(info.name)
        : typeof value === 'string'
          ? parse(value)
          : isNormalizedDate(value)
            ? value
            : null;
    if (!parsedDate) {
      logger.error('Unable to parse input: %o', value);
      return;
    }

    await input(logger, info, parsedDate);
  },
  start() {
    if (!running) {
      stop = false;
      result = { success: 0, skipped: 0 };
      running = run().finally(() => (running = undefined));
    }
    return running;
  },
  stop() {
    stop = true;
    return running;
  },
  status() {
    summary(logger, result, 'Status: %o', running ? 'Running' : 'Not Running');
  }
};
