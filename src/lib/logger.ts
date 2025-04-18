import { ID } from '../constants.js';

export class Logger {
  constructor(private readonly nth?: () => string | number) {}

  private print(
    type: 'log' | 'warn' | 'error',
    ...args: [string, ...unknown[]]
  ) {
    const msgs = ['[%s]'];
    const params: unknown[] = [ID];
    const nth = this.nth?.();

    if (nth != null) {
      params.push(nth);
      msgs.push('[%o]');
    }
    if (args.length > 0) msgs.push(args[0]);

    const message = msgs.join(' ');
    const values = ([message] as unknown[]).concat(params, args.slice(1));

    console[type](...values);
  }

  log(...args: [string, ...unknown[]]): void {
    this.print('log', ...args);
  }

  warn(...args: [string, ...unknown[]]): void {
    this.print('warn', ...args);
  }

  error(...args: [string, ...unknown[]]): void {
    this.print('error', ...args);
  }
}
