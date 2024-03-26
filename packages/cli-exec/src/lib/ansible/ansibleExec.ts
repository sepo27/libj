import { zxec, ZxecParams } from '../zxec';
import { isArr, isObj } from '../../../../cli/dist/common/isType/isType';
import { ZxOpts } from '../../zx/ZxOpts';

type Params =
  [string]
  | [string, string[]]
  | [string, ZxOpts]
  | [string, string[], ZxOpts];

export const ansibleExec = (...args: Params) => {
  const
    { opts, pattern, zxOpts } = extractArgs(args),
    zxParams: ZxecParams = ['ansible', [pattern, ...opts]];

  if (zxOpts) {
    zxParams.push(zxOpts);
  }

  return zxec(...zxParams);
};

/*** Private ***/

function extractArgs(args) {
  let pattern, opts = [], zxOpts;

  if (args.length === 1) {
    pattern = args[0];
  } else if (args.length === 2 && isArr(args[1])) {
    ([pattern, opts] = args);
  } else if (args.length === 2 && isObj(args[1])) {
    ([pattern, zxOpts] = args);
  } else if (args.length === 3) {
    ([pattern, opts, zxOpts] = args);
  }

  return { pattern, opts, zxOpts };
}
