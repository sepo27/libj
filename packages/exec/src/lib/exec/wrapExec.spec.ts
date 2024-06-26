import { ExecTBench } from '../../../@spec/bench/ExecTBench';
import * as ExecModule from './exec';
import { wrapExec } from './wrapExec';
import { ListWrapExecParams } from '../types';

describe('wrapExec()', () => {
  let bench: ExecTBench, execMock;

  beforeEach(() => {
    bench = new ExecTBench();
    execMock = bench.mock.sinon.stub(ExecModule, 'exec');
  });

  afterEach(() => {
    bench.restore();
  });

  it('passes through some exec with list params', () => {
    const
      exec = 'docker',
      params = [['-D'], 'ps', ['-a'], { verbose: true }],
      dummyRes = { dummy: 'res' };

    execMock.returns(dummyRes);

    const res = wrapExec(exec, ...params as ListWrapExecParams);

    expect(execMock.callCount).toBe(1);
    expect(execMock.getCall(0).args).toEqual([exec, ...params]);
    expect(res).toBe(dummyRes);
  });

  it('passes through some exec with struct params', () => {
    const
      exec = 'docker',
      params = {
        execOpts: ['-c', 'abc'],
        command: 'exec',
        commandOptsAndArgs: ['-it', 'foo_run_123', 'ls'],
        zxOpts: { verbose: true },
      },
      dummyRes = { dummy: 'res' };

    execMock.returns(dummyRes);

    const res = wrapExec(exec, params);

    expect(execMock.callCount).toBe(1);
    expect(execMock.getCall(0).args).toEqual([{
      exec,
      ...params,
    }]);
    expect(res).toBe(dummyRes);
  });
});
