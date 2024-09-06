import * as sinonLib from 'sinon';
import { ModuleMockT } from './types';

// TODO: proper return type ?

/*** Main ***/

type Module = string | Object;

interface Opts {
  skipProps?: string[]
}

type Params = [Module] | [Module, sinonLib.SinonSandbox] | [Module, Opts] | [Module, sinonLib.SinonSandbox, Opts];

export function ModuleMock<R extends ModuleMockT>(...topArgs: Params): R {
  const { module, sinon, opts } = expandArgs(topArgs);

  /*** Constructor ***/

  const cache = new Cache();

  /*** Public ***/

  const self = {
    $restore: () => { sinon.restore(); },
  };

  return new Proxy({}, {
    get(_, prop) {
      // @ts-ignore
      if (opts.skipProps?.indexOf(prop) > -1) {
        return undefined;
      }

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

function expandArgs(args) {
  let module, sinon = sinonLib.createSandbox(), opts: Opts = {};

  if (args.length === 1) {
    module = args[0];
  } else if (args.length === 2 && args[1].assert) {
    ([module, sinon] = args);
  } else if (args.length === 2) {
    ([module, opts] = args);
  } else if (args.length === 3) {
    ([module, sinon, opts] = args);
  } else {
    throw new Error('Unexpected args');
  }

  if (typeof module === 'string') {
    module = require(module); // eslint-disable-line no-param-reassign, import/no-dynamic-require, global-require
  }

  return { module, sinon, opts };
}

class Cache {
  private bag = {};

  public has(prop): boolean { return !!this.bag[prop]; }
  public get(prop) { return this.bag[prop]; }
  public set(prop, stub) {
    this.bag[prop] = stub;
    return stub;
  }
}
