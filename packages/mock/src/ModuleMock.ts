import * as sinonLib from 'sinon';

// TODO: proper return type ?

/*** Main ***/

export function ModuleMock(ref: string): any {
  /*** Constructor ***/

  const
    sinon = sinonLib.createSandbox(),
    module = require(ref), // eslint-disable-line import/no-dynamic-require, global-require
    cache = new Cache(); // eslint-disable-line no-use-before-define

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

      return cache.set(prop, sinon.stub(module, prop));
    },
  });
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
