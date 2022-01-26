import { LooseObject } from '../../../common/types';
import { isObj, isStr } from '../../../common/isType/isType';

export type CliArgParams<O = LooseObject> = [] | [string] | [string, string] | [string, O] | [string, string, O];

interface Defaults<O = LooseObject> {
  arg: string,
  description: string,
  opts?: O,
}

type Result<O> = [string, string, O];

export const parseCliArgParams = <O = LooseObject>(params: CliArgParams<O>, defaults: Defaults<O>): Result<O> => {
  let
    arg = defaults.arg,
    description = defaults.description,
    opts: O = defaults.opts || {} as O;

  if (params.length === 1) {
    arg = params[0];
  } else if (params.length === 2 && isStr(params[1])) {
    ([arg, description] = params as [string, string]);
  } else if (params.length === 2 && isObj(params[1])) {
    ([arg, opts] = params as [string, O]);
  } else if (params.length === 3 && isObj(params[2])) {
    ([arg, description, opts] = params);
  } else if (params.length !== 0) {
    throw new Error('Invalid params');
  }

  return [arg, description, opts];
};
