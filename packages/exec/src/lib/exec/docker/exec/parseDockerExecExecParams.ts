import {
  DockerExecExecParams,
  ListDockerExecExecParams,
  PartialStructDockerExecExecParams,
  StructDockerExecExecParams,
} from './types';
import { isArr, isObj, isStr } from '../../../../../../../common/isType/isType';
import { DefaultStructDockerExecExecParams } from './constants';

type Params = DockerExecExecParams | PartialStructDockerExecExecParams;

export const parseDockerExecExecParams = (params: Params): StructDockerExecExecParams => {
  if (
    (isArr(params) && (params as [PartialStructDockerExecExecParams]).length === 1 && isObj(params[0]))
    || isObj(params)
  ) {
    const structParams = {
      ...DefaultStructDockerExecExecParams,
      ...(isObj(params) ? params : params[0]),
    };

    if (!structParams.container || !structParams.containerArgs || !structParams.containerArgs.length) {
      throw new Error('Missing <container> and/or <containerArgs>');
    }

    return structParams;
  }

  const listParams = params as ListDockerExecExecParams;
  // let { container, containerArgs, execOpts, dockerOpts, zxOpts } = DefaultStructDockerExecExecParams; // TODO
  let container, containerArgs, execOpts, dockerOpts, zxOpts;

  // <container> <...containerArgs>
  // [<...execOpts>, <container] <...containerArgs>
  if (listParams.length === 2 && isContainerOrItsArgs(listParams[0]) && isContainerOrItsArgs(listParams[1])) {
    if (isStr(listParams[0])) {
      container = listParams[0];
    } else {
      container = (listParams[0] as string[]).pop();
      execOpts = listParams[0];
    }
    containerArgs = isArr(listParams[1]) ? listParams[1] : [listParams[1]];

  // [...dockerOpts] <container> <...containerArgs>
  // [...dockerOpts] [<...execOpts>, <container>] <...containerArgs>
  } else if (
    listParams.length === 3
    && isArr(listParams[0])
    && isContainerOrItsArgs(listParams[1])
    && isContainerOrItsArgs(listParams[2])
  ) {
    dockerOpts = listParams[0];
    if (isStr(listParams[1])) {
      container = listParams[1];
    } else {
      container = (listParams[1] as string[]).pop();
      execOpts = listParams[1];
    }
    containerArgs = isArr(listParams[2]) ? listParams[2] : [listParams[2]];

  // <container> <...containerArgs> <zxOpts>
  // [<...execOpts>, <container>] <...containerArgs> <zxOpts>
  } else if (
    listParams.length === 3
    && isContainerOrItsArgs(listParams[0])
    && isContainerOrItsArgs(listParams[1])
    && isObj(listParams[2])
  ) {
    if (isStr(listParams[0])) {
      container = listParams[0];
    } else {
      container = (listParams[0] as string[]).pop();
      execOpts = listParams[0];
    }
    containerArgs = isArr(listParams[1]) ? listParams[1] : [listParams[1]];
    zxOpts = listParams[2];

  // [...dockerOpts] [<...execOpts>, <container>] <...containerArgs> <zxOpts>
  } else if (
    listParams.length === 4
    && isArr(listParams[0])
    && isArr(listParams[1])
    && isContainerOrItsArgs(listParams[2])
    && isObj(listParams[3])
  ) {
    dockerOpts = listParams[0];
    container = (listParams[1] as string[]).pop();
    execOpts = listParams[1];
    containerArgs = isArr(listParams[2]) ? listParams[2] : [listParams[2]];
    zxOpts = listParams[3];
  } else {
    throw new Error('Invalid dockerExecExec params');
  }

  return { container, containerArgs, execOpts, dockerOpts, zxOpts };
};

/*** Private ***/

function isContainerOrItsArgs(val) {
  return isStr(val) || isArr(val);
}
