import * as sinonLib from 'sinon';

export class TMock {
  constructor() {
    this.sinon = sinonLib.createSandbox();
  }

  /*** Public ***/

  public readonly sinon: sinonLib.SinonSandbox;

  public restore() { this.sinon.restore(); }

  /*** Protected ***/

  protected makeMock(name: string, factory: () => sinonLib.SinonStub) {
    if (this.mocks[name]) { return this.mocks[name]; }
    return (this.mocks[name] = factory());
  }

  /*** Private ***/

  private mocks: { [key: string]: sinonLib.SinonStub } = {};
}
