import * as sinonLib from 'sinon';

export class TMock {
  constructor() {
    this.sinon = sinonLib.createSandbox();
  }

  public restore() {
    this.sinon.restore();
  }

  public readonly sinon: sinonLib.SinonSandbox;
}
