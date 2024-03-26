import { zxec, ZxecParams, ZxecResponse } from './zxec';
import { isArr, isObj, isStr } from '../../../cli/dist/common/isType/isType';
import { ZxOpts } from '../zx/ZxOpts';

type Params =
  // <exec> <command> ...
  [string]
  | [string, string]
  | [string, string, string[]]
  | [string, string, ZxOpts]
  | [string, string, string[], ZxOpts]

  // <exec> [...opts] ...
  | [string, string[]]
  | [string, string[], string]
  | [string, string[], string, string[]]
  | [string, string[], string, ZxOpts]
  | [string, string[], string, string[], ZxOpts]
  | [string, string[], ZxOpts]

export type CommonExecResponse = ZxecResponse;

export const commonExec = (...args: Params): CommonExecResponse => {
  const
    { exec, opts, command, commandArgs, zxOpts } = extractArgs(args),
    zxCommandArgs: string[] = [],
    zxParams: ZxecParams = [exec];

  if (opts) {
    zxCommandArgs.push(...opts);
  }

  if (command) {
    zxCommandArgs.push(command);
  }

  if (commandArgs) {
    zxCommandArgs.push(...commandArgs);
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

/*** Private ***/

function extractArgs(args) {
  let exec, opts, command, commandArgs, zxOpts;

  // commonExec(<exec>)
  if (args.length === 1 && isStr(args[0])) {
    exec = args[0];

  // commonExec(<exec>, <command>)
  } else if (args.length === 2 && isStr(args[0]) && isStr(args[1])) {
    ([exec, command] = args);

  // commonExec(<exec>, <command>, [...args])
  } else if (args.length === 3 && isStr(args[0]) && isStr(args[1]) && isArr(args[2])) {
    ([exec, command, commandArgs] = args);

  // commonExec(<exec>, <command>, {...zxOpts})
  } else if (args.length === 3 && isStr(args[0]) && isStr(args[1]) && isObj(args[2])) {
    ([exec, command, zxOpts] = args);

  // commonExec(<exec>, <command>, [...args], {...zxOpts})
  } else if (args.length === 4 && isStr(args[0]) && isStr(args[1]) && isArr(args[2]) && isObj(args[3])) {
    ([exec, command, commandArgs, zxOpts] = args);

  // commonExec(<exec>, [...opts])
  } else if (args.length === 2 && isStr(args[0]) && isArr(args[1])) {
    ([exec, opts] = args);

  // commonExec(<exec>, [...opts], <command>)
  } else if (args.length === 3 && isStr(args[0]) && isArr(args[1]) && isStr(args[2])) {
    ([exec, opts, command] = args);

  // commonExec(<exec>, [...opts], <command>, [...args])
  } else if (args.length === 4 && isStr(args[0]) && isArr(args[1]) && isArr([2]) && isArr(args[3])) {
    ([exec, opts, command, commandArgs] = args);

  // commonExec(<exec>, [...opts], <command>, {...zxOpts})
  } else if (args.length === 4 && isStr(args[0]) && isArr(args[1]) && isStr(args[2]) && isObj(args[3])) {
    ([exec, opts, command, zxOpts] = args);

  // commonExec(<exec>, [...opts], <command>, [...args], {...zxOpts})
  } else if (
    args.length === 5
    && isStr(args[0])
    && isArr(args[1])
    && isStr(args[2])
    && isArr(args[3])
    && isObj(args[4])
  ) {
    ([exec, opts, command, commandArgs, zxOpts] = args);

  // commonExec(<exec>, [...opts], {...zxOpts})
  } else if (args.length === 3 && isStr(args[0]) && isArr(args[1]) && isObj(args[2])) {
    ([exec, opts, zxOpts] = args);

  // Invalid args
  } else {
    throw new Error('Invalid commonExec args given');
  }

  return { exec, opts, command, commandArgs, zxOpts };
}
