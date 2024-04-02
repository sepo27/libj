import { ExecParams, ListExecParams, PartialStructExecParams, StructExecParams } from '../types';
import { isArr, isObj, isStr } from '../../../../../common/isType/isType';
import { DefaultStructExecParams } from './constants';

type Params = ExecParams | PartialStructExecParams;

export const parseExecParams = (params: Params): StructExecParams => {
  /*** Struct exec params case ***/

  if (isObj(params) || (isArr(params) && (params as [PartialStructExecParams]).length === 1 && isObj(params[0]))) {
    const structParams = {
      ...DefaultStructExecParams,
      ...(isArr(params) ? params[0] : params),
    } as StructExecParams;

    if (!structParams.exec) {
      throw new Error('Missing at least <exec> in struct exec params');
    }

    return structParams;
  }

  /*** List exec params case ***/

  const lparams = params as ListExecParams;
  let { exec, execOpts, command, commandOptsAndArgs, zxOpts } = DefaultStructExecParams;

  // <exec>
  if (lparams.length === 1) {
    exec = lparams[0];

  // <exec> <command>
  } else if (lparams.length === 2 && isStr(lparams[0]) && isStr(lparams[1])) {
    ([exec, command] = lparams);

  // <exec> <command> [...commandOptsAndArgs]
  } else if (lparams.length === 3 && isStr(lparams[0]) && isStr(lparams[1]) && isArr(lparams[2])) {
    ([exec, command, commandOptsAndArgs] = lparams);

  // <exec> <command> <zxOpts>
  } else if (lparams.length === 3 && isStr(lparams[0]) && isStr(lparams[1]) && isObj(lparams[2])) {
    ([exec, command, zxOpts] = lparams);

  // <exec> <command> [...commandOptsAndArgs] <zxOpts>
  } else if (lparams.length === 4 && isStr(lparams[0]) && isStr(lparams[1]) && isArr(lparams[2]) && isObj(lparams[3])) {
    ([exec, command, commandOptsAndArgs, zxOpts] = lparams);

  // <exec> [...execOpts]
  } else if (lparams.length === 2 && isStr(lparams[0]) && isArr(lparams[1])) {
    ([exec, execOpts] = lparams);

  // <exec> [...execOpts] <command>
  } else if (lparams.length === 3 && isStr(lparams[0]) && isArr(lparams[1]) && isStr(lparams[2])) {
    ([exec, execOpts, command] = lparams);

  // <exec> [...execOpts] <command> [...commandOptsAndArgs]
  } else if (lparams.length === 4 && isStr(lparams[0]) && isArr(lparams[1]) && isStr(lparams[2]) && isArr(lparams[3])) {
    ([exec, execOpts, command, commandOptsAndArgs] = lparams);

  // <exec> [...execOpts] <zxOpts>
  } else if (lparams.length === 3 && isStr(lparams[0]) && isArr(lparams[1]) && isObj(lparams[2])) {
    ([exec, execOpts, zxOpts] = lparams);

  // <exec> [...execOpts] <command> <zxOpts>
  } else if (lparams.length === 4 && isStr(lparams[0]) && isArr(lparams[1]) && isStr(lparams[2]) && isObj(lparams[3])) {
    ([exec, execOpts, command, zxOpts] = lparams);

  // <exec> [...execOpts] <command> [...commandOptsAndArgs] <zxOpts>
  } else if (
    lparams.length === 5
    && isStr(lparams[0])
    && isArr(lparams[1])
    && isStr(lparams[2])
    && isArr(lparams[3])
    && isObj(lparams[4])
  ) {
    ([exec, execOpts, command, commandOptsAndArgs, zxOpts] = lparams);
  } else {
    throw new Error('Invalid exec params given');
  }

  return { exec, execOpts, command, commandOptsAndArgs, zxOpts };
};
