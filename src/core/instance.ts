import { NAME } from '../constants';
import { Logger } from '../lib/logger';
import { parseInput } from '../lib/parse-input';
import { getPhotoInfo } from '../lib/photo-info';
import { delay } from '../utils/delay';
import { AutoDatetime, Result } from './core.types';
import { input } from './input';
import { meta } from './meta';
import { next, previous } from './navigation';
import { parse, parsers } from './parsers';

let stop = false;
let running: Promise<void> | undefined;
let result: Result = { success: 0, skipped: 0 };

async function run() {
  const MAX_RETRIES = 5;
  let nth = 1;
  let attempts = 0;
  let prevName: string | undefined;
  const logger = new Logger(() => ({ message: '[%o]', args: [nth] }));

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
}

// root logger
const LOG = new Logger();

function summary(result: Result, message: string, ...args: string[]): void {
  LOG.log(
    `${message}\n` + '- Success: %o\n' + '- Skipped: %o\n' + '- Total: %o',
    ...args,
    result.success,
    result.skipped,
    result.success + result.skipped
  );
}

function block() {
  LOG.warn(
    'Cannot perform this action while %o is running. Enter %o to stop.',
    NAME,
    `${NAME}.stop()`
  );
}

export const instance: AutoDatetime = {
  meta,
  parsers,
  next() {
    if (running) return block();
    next(LOG);
  },
  previous() {
    if (running) return block();
    previous(LOG);
  },
  parse(value) {
    return parseInput(value);
  },
  async input(value) {
    if (running) return block();

    const info = getPhotoInfo();
    if (!info) {
      LOG.error('Unable to parse date and time info.');
      return;
    }

    const parsedDate = parseInput(value, info);
    if (!parsedDate) {
      LOG.error('Unable to parse input: %o', value);
      return;
    }

    await input(LOG, info, parsedDate);
  },
  start() {
    const msg = 'Enter %o to stop and %o to check status.';
    const args = [`${NAME}.stop()`, `${NAME}.status()`];
    if (running) {
      LOG.warn(`%o already started. ${msg}`, NAME, ...args);
    } else {
      LOG.log(`Starting %o. ${msg}`, NAME, ...args);

      stop = false;
      result = { success: 0, skipped: 0 };
      running = run().finally(() => {
        running = undefined;
        summary(
          result,
          '%s. Enter %o to start again.',
          stop ? 'Stopped' : 'Done',
          `${NAME}.start()`
        );
      });
    }
    return running;
  },
  stop() {
    stop = true;
    if (running) LOG.log('Stopping %o.', NAME);
    return running;
  },
  status() {
    summary(result, 'Status: %o', running ? 'Running' : 'Not Running');
  }
};
