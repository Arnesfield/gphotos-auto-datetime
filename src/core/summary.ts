import { Logger } from '../lib/logger.js';
import { Result } from '../types.js';

export function summary(
  logger: Logger,
  result: Result,
  message: string,
  ...args: string[]
): void {
  logger.log(
    `${message}\n` + '- Success: %o\n' + '- Skipped: %o\n' + '- Total: %o',
    ...args,
    result.success,
    result.skipped,
    result.success + result.skipped
  );
}
