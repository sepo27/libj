import { LoggerArg, LoggerInterface } from '../LoggerInterface';
import { BaseLogger } from '../base/BaseLogger';
import { LoggerLevel } from '../LoggerLevel';

export class ConsoleLogger extends BaseLogger implements LoggerInterface {
  public log(message: string, ...args: LoggerArg[]) {
    console.log(this.format(LoggerLevel.LOG, message, args));
  }

  public info(message: string, ...args: LoggerArg[]) {
    console.info(this.format(LoggerLevel.INFO, message, args));
  }

  public warn(message: string, ...args: LoggerArg[]) {
    console.warn(this.format(LoggerLevel.WARN, message, args));
  }

  public error(message: string, ...args: LoggerArg[]) {
    console.error(this.format(LoggerLevel.ERROR, message, args));
  }

  public debug(message: string, ...args: LoggerArg[]) {
    console.debug(this.format(LoggerLevel.DEBUG, message, args));
  }

  public print(message: string, ...args: LoggerArg[]) {
    process.stdout.write(this.sprintf(message, args));
  }

  public println(message: string = '', ...args: LoggerArg[]) {
    this.print(`${message}\n`, ...args);
  }

  public printSameLn(message: string, ...args: LoggerArg[]) {
    this.print(`${message}\r`, args);
  }
}
