import { ListWrapExecParams, StructExecParams, StructWrapExecParams, WrapExecParams } from '../types';
import { parseExecParams } from './parseExecParams';
import { WRAP_EXEC_STUB } from './constants';
import { isArr, isObj } from '../../../../../common/isType/isType';

type Params = WrapExecParams | StructWrapExecParams;

export const parseWrapExecParams = (params: Params): StructExecParams => {
  if (isObj(params) || (isArr(params) && isObj(params[0]))) {
    return parseExecParams({
      ...(isObj(params) ? params : params[0]),
      exec: WRAP_EXEC_STUB,
    });
  }
  return parseExecParams([WRAP_EXEC_STUB, ...params as ListWrapExecParams]);
};
