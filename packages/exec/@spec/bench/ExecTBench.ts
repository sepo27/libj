import { TBench } from '../../../../@spec/bench/TBench';
import { ExecTMock } from './ExecTMock';
import { ExecTAssert } from './ExecTAssert';

export class ExecTBench extends TBench {
  constructor() {
    super();
    this.mock = new ExecTMock();
    this.assert = new ExecTAssert(this.mock);
  }

  /*** Public ***/

  public readonly mock: ExecTMock;
  public readonly assert: ExecTAssert;
}
