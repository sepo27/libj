import { TBench } from '../../../../@spec/bench/TBench';
import { CliExecTMock } from './CliExecTMock';
import { CliExecTAssert } from './CliExecTAssert';

export class CliExecTBench extends TBench {
  constructor() {
    super();
    this.mock = new CliExecTMock();
    this.assert = new CliExecTAssert(this.mock);
  }

  /*** Public ***/

  public readonly mock: CliExecTMock;
  public readonly assert: CliExecTAssert;
}
