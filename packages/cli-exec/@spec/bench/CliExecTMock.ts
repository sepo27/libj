import * as sinonLib from 'sinon';
import { $ } from 'zx';
import { TMock } from '../../../../@spec/bench/TMock';
import { LooseObject } from '../../../../common/types';
import * as ZxModule from '../../src/zx/zx';
import { ZxOptsList } from '../../src/zx/ZxOpts';
import * as ZxecModule from '../../src/lib/zxec';

export class CliExecTMock extends TMock {
  /*** Public ***/

  public get zx(): sinonLib.SinonStub {
    return this.getStub('zx', () => this.sinon.stub(ZxModule, 'zx'));
  }

  public zxOpts() {
    ZxOptsList.forEach(opt => {
      this.orig$Opts[opt] = $[opt];
    });
  }

  public get zxec(): sinonLib.SinonStub {
    return this.getStub('zxec', () => this.sinon.stub(ZxecModule, 'zxec'));
  }

  /*** Private ***/

  private orig$Opts = {};

  private stubs: LooseObject = {};

  private getStub(name: string, factory: () => sinonLib.SinonStub): sinonLib.SinonStub {
    if (this.stubs[name]) {
      return this.stubs[name];
    }

    return (this.stubs[name] = factory());
  }
}
