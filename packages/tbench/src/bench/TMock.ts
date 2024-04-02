import * as sinonLib from 'sinon';

export class TMock {
  constructor() {
    this.sinon = sinonLib.createSandbox();
  }

  /*** Public ***/

  public readonly sinon: sinonLib.SinonSandbox;

  public restore() { this.sinon.restore(); }
}
