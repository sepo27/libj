// TODO: move to  packages/logger

export type LoggerArg = (string|number|any[]|Object);

export interface LoggerInterface {
  log(message: string, ...args: LoggerArg[])
  info(message: string, ...args: LoggerArg[])
  warn(message: string, ...args: LoggerArg[])
  error(message: string, ...args: LoggerArg[])
  debug(message: string, ...args: LoggerArg[])
}
