import { $ } from 'zx';
import { ExecTMock } from './ExecTMock';
import { isStr } from '../../../../common/isType/isType';
import { ZxOpts } from '../../src/zx/ZxOpts';

export class ExecTAssert {
  // eslint-disable-next-line no-empty-function,no-useless-constructor
  constructor(private mock: ExecTMock) {}

  /*** Public ***/

  public zxCall(expected: string | string[]) {
    const
      call = this.mock.zx.getCall(0),
      actualArgs = call?.args;

    expect(actualArgs).toBeDefined();

    if (isStr(expected)) {
      expect(actualArgs).toEqual([[expected]]);
    } else {
      const
        [commandArgs, argsArgs] = actualArgs,
        // @ts-ignore
        [expectedCommand, ...expectedArgs] = expected;

      expect(commandArgs).toEqual([`${expectedCommand} `, '']);
      expect(argsArgs).toEqual(expectedArgs);
    }
  }

  public zxOpts(map: ZxOpts) {
    Object.keys(map).forEach(k => {
      expect($[k]).toEqual(map[k]);
    });
  }

  public zxecCall(...expectedArgs) {
    const
      call = this.mock.zxec.getCall(0),
      actualArgs = call?.args;

    expect(actualArgs).toBeDefined();
    expect(actualArgs).toEqual(expectedArgs);
  }
}
