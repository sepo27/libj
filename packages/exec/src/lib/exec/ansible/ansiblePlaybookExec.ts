import { zxec, ZxecParams } from '../zxec';
import { ZxOpts } from '../../../zx/ZxOpts';
import { isArr, isObj } from '../../../../../../common/isType/isType';

type Params =
  | string[]
  | [...string[], string[]]
  | [...string[], ZxOpts]
  | [...string[], string[], ZxOpts]

export { Params as AnsiblePlaybookExecParams };

export const ansiblePlaybookExec = (...args: Params) => {
  const
    { playbooks, opts, zxOpts } = extractArgs(args),
    zxParams: ZxecParams = ['ansible-playbook', [...playbooks, ...opts]];

  if (zxOpts) {
    zxParams.push(zxOpts);
  }

  return zxec(...zxParams);
};

function extractArgs(args: Params) {
  let playbooks, opts = [], zxOpts;

  const nextArgs = [...args];

  if (isObj(nextArgs[nextArgs.length - 1])) {
    zxOpts = nextArgs.pop();
  }

  if (isArr(nextArgs[nextArgs.length - 1])) {
    // @ts-ignore: TODO
    opts = nextArgs.pop();
  }

  // eslint-disable-next-line prefer-const
  playbooks = nextArgs;

  return { opts, playbooks, zxOpts };
}

export { extractArgs as extractAnsiblePlaybookExecArgs };
