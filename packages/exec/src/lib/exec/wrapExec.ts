import { ListWrapExecParams, StructWrapExecParams, WrapExecParams } from '../types';
import { exec, ExecResponse } from './exec';
import { isObj } from '../../../../../common/isType/isType';

export const wrapExec = (execName: string, ...params: WrapExecParams): ExecResponse => {
  if (params.length === 1 && isObj(params[0])) {
    return exec({ ...params[0] as StructWrapExecParams, exec: execName });
  }
  return exec(execName, ...params as ListWrapExecParams);
};
