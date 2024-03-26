import { TMock } from './TMock';

export class TBench {
  constructor() {
    this.mock = new TMock();
  }

  /*** Public ***/

  public readonly mock: TMock;

  public restore() { this.mock.restore(); }
}
