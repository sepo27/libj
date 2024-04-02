import { zxec, ZxecParams, ZxecResponse } from './zxec';
import { parseExecParams } from '../util/parseExecParams';
import { ExecParams } from '../types';

export type ExecResponse = ZxecResponse;

export const exec = (...params: ExecParams): ExecResponse => {
  const
    { exec: execCommand, execOpts, command, commandOptsAndArgs, zxOpts } = parseExecParams(params),
    zxCommandArgs: string[] = [],
    zxParams: ZxecParams = [execCommand];

  if (execOpts) {
    zxCommandArgs.push(...execOpts);
  }

  if (command) {
    zxCommandArgs.push(command);
  }

  if (commandOptsAndArgs) {
    zxCommandArgs.push(...commandOptsAndArgs);
  }

  if (zxCommandArgs.length) {
    // @ts-ignore: TODO
    zxParams.push(zxCommandArgs);
  }

  if (zxOpts) {
    // @ts-ignore: TODO
    zxParams.push(zxOpts);
  }

  return zxec(...zxParams);
};
