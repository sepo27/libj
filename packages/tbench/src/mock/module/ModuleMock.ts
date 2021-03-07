import * as sinonLib from 'sinon';
import { ModuleMockT } from './types';

// TODO: proper return type ?

/*** Main ***/

type Module = string | Object;

export function ModuleMock<R extends ModuleMockT>(
  module: Module,
  sinon: sinonLib.SinonSandbox = sinonLib.createSandbox(),
): R {
  /*** Constructor ***/

  if (typeof module === 'string') {
    module = require(module); // eslint-disable-line no-param-reassign, import/no-dynamic-require, global-require
  }

  const cache = new Cache();

  /*** Public ***/

  const self = {
    $restore: () => { sinon.restore(); },
  };

  return new Proxy({}, {
    get(_, prop) {
      if (self[prop]) {
        return (...args) => self[prop](...args);
      }

      if (cache.has(prop)) {
        return cache.get(prop);
      }

      // @ts-ignore: TODO
      return cache.set(prop, sinon.stub(module, prop));
    },
  }) as any;
}

/*** Lib ***/

class Cache {
  private bag = {};

  public has(prop): boolean { return !!this.bag[prop]; }
  public get(prop) { return this.bag[prop]; }
  public set(prop, stub) {
    this.bag[prop] = stub;
    return stub;
  }
}
