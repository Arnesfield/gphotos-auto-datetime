import { name } from '../package-json.js';

export class Logger {
  constructor(
    private readonly prefix?: () => { message: string; args: unknown[] }
  ) {}

  private print(
    type: 'log' | 'warn' | 'error',
    ...args: [string, ...unknown[]]
  ) {
    const msgs = ['[%s]'];
    const pArgs: unknown[] = [name];
    const prefix = this.prefix?.();

    if (prefix) {
      msgs.push(prefix.message);
      pArgs.push(...prefix.args);
    }
    if (args.length > 0) msgs.push(args[0]);

    const message = msgs.join(' ');
    const values = ([message] as unknown[]).concat(pArgs, args.slice(1));

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
