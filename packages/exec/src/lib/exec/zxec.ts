import { ProcessOutput, ProcessPromise, $ } from 'zx';
import { zx } from '../../zx/zx';
import { ZxOpts } from '../../zx/ZxOpts';
import { isArr, isObj, isStr } from '../../../../../common/isType/isType';
import { setZxOpts } from '../../zx/setZxOpts';

const DefaultZxOpts: ZxOpts = { verbose: false };

type Params =
  [string]
  | [string, string[]]
  | [string, ZxOpts]
  | [string, string[], ZxOpts];

export { Params as ZxecParams };

export type ZxecResponse = ProcessPromise<ProcessOutput>;

export const zxec = (...args: Params): ZxecResponse => {
  const
    { command, commandArgs, zxOpts = {} } = extractArgs(args),
    zxParams = command && commandArgs
      ? [[`${command} `, ''], commandArgs]
      : [[command]];

  setOpts(zxOpts);

  // @ts-ignore
  return zx(...zxParams);
};

/*** Private ***/

function extractArgs(args) {
  let command, commandArgs, zxOpts;

  // zxec(<command>)
  if (args.length === 1) {
    command = args[0];

  // zxec(<command>, [...args])
  } else if (args.length === 2 && isStr(args[0]) && isArr(args[1])) {
    ([command, commandArgs] = args);

  // zxec(<command>, {...zxOpts})
  } else if (args.length === 2 && isStr(args[0]) && isObj(args[1])) {
    ([command, zxOpts] = args);

  // zxec(<command>, [...args], {..zxOpt})
  } else if (args.length === 3 && isStr(args[0]) && isArr(args[1]) && isObj(args[2])) {
    ([command, commandArgs, zxOpts] = args);
  } else {
    throw new Error('Invalid zxec args given');
  }

  return { command, commandArgs, zxOpts };
}

function setOpts(opts) {
  const nextOpts = { ...opts };

  if (nextOpts.allowSubScript) {
    const ctx = { origQuote: $.quote };
    nextOpts.quote = allowSubScriptQuoteFn.bind(ctx);
    delete nextOpts.allowSubScript;
  }

  setZxOpts({ ...DefaultZxOpts, ...nextOpts });
}

function allowSubScriptQuoteFn(val) {
  if (val.indexOf('`') === 0 || val.indexOf('$(') === 0) {
    return val;
  }
  return this.origQuote(val);
}
