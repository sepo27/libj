import { sprintf, vsprintf } from 'sprintf-js';
import { LoggerLevel } from '../LoggerLevel';
import { isEnumVal } from '../../../../common/isType/isType';
import { LoggerArg } from '../LoggerInterface';

type FormatArgs = [string] | [string, LoggerArg[]] | [LoggerLevel, string] | [LoggerLevel, string, LoggerArg[]];

interface Options {
  prefix?: string,
}

export abstract class BaseLogger {
  constructor(options: Options = {}) {
    this.options = options;
  }

  /*** Public ***/

  public setOptions(options: Options) {
    this.options = options;
  }

  /*** Protected ***/

  protected options: Options;

  protected format(...args: FormatArgs): string {
    const
      { level, message, formatArgs } = this.extractFormatArgs(args),
      prefix = [];

    if (this.options.prefix) {
      prefix.push(sprintf('[%s]', this.options.prefix));
    }

    if (level) {
      prefix.push(level);
    }

    const finalMessage = prefix.length
      ? sprintf('%s: %s', prefix.join(' '), message)
      : message;

    try {
      return this.sprintf(finalMessage, formatArgs);
    } catch (err) {
      if (this.isSprintfError(err)) {
        return finalMessage;
      }
      throw err;
    }
  }

  protected sprintf(message: string, args: LoggerArg[]) {
    return vsprintf(message, args);
  }

  /*** Private ***/

  private extractFormatArgs(args) {
    let level, message, formatArgs = [];

    if (args.length === 1) {
      message = args[0];
    } else if (args.length === 2 && isEnumVal(LoggerLevel, args[0])) {
      ([level, message] = args);
    } else if (args.length === 2) {
      ([message, formatArgs] = args);
    } else if (args.length === 3) {
      ([level, message, formatArgs] = args);
    } else {
      throw new Error('Invalid args');
    }

    return { level, message, formatArgs };
  }

  private isSprintfError(err: Error): boolean {
    return err.message.includes('[sprintf]');
  }
}
