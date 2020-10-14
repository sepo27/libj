import { ModuleMockFactory, ModuleMockMap, ModuleMockT } from './types';

// TODO: tests

interface Input {
  [key: string]: ModuleMockT | ModuleMockFactory;
}

export const combineTMock = <I extends Input>(input: I): ModuleMockMap =>
  Object
    .keys(input)
    .reduce((acc, k) => Object.assign(acc, {
      [k]: typeof input[k] === 'function'
        ? (input[k] as ModuleMockFactory)({ mock: acc })
        : input[k],
    }), {});
