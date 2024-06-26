import { ExecTBench } from '../../../@spec/bench/ExecTBench';
import * as ParseExecParamsModule from './parseExecParams';
import { parseWrapExecParams } from './parseWrapExecParams';
import { ListWrapExecParams, StructWrapExecParams } from '../types';
import { WRAP_EXEC_STUB } from './constants';

describe('parseWrapExecParams()', () => {
  let bench: ExecTBench, parseExecParamsMock;

  beforeEach(() => {
    bench = new ExecTBench();
    parseExecParamsMock = bench.mock.sinon.stub(ParseExecParamsModule, 'parseExecParams');
  });

  afterEach(() => {
    bench.restore();
  });

  it('parses list params without exec', () => {
    const exepectedRes = {
      exec: WRAP_EXEC_STUB,
      command: 'exec',
      commandOptsAndArgs: ['-it', 'foo', 'ls'],
      zxOpts: { verbose: true },
    };

    parseExecParamsMock.returns(exepectedRes);

    const params = ['exec', ['-it', 'foo', 'ls'], { verbose: true }];

    const res = parseWrapExecParams(params as ListWrapExecParams);

    expect(parseExecParamsMock.callCount).toBe(1);
    expect(parseExecParamsMock.getCall(0).args).toEqual([[WRAP_EXEC_STUB, ...params]]);
    expect(res).toBe(exepectedRes);
  });

  it('parses struct params without exec', () => {
    const exepectedRes = {
      exec: WRAP_EXEC_STUB,
      command: 'exec',
      commandOptsAndArgs: ['-it', 'foo', 'ls'],
      zxOpts: { verbose: true },
    };

    parseExecParamsMock.returns(exepectedRes);

    const params = {
      command: 'exec',
      commandOptsAndArgs: ['-it', 'foo', 'ls'],
      zxOpts: { verbose: true },
    };

    const res = parseWrapExecParams(params as StructWrapExecParams);

    expect(parseExecParamsMock.callCount).toBe(1);
    expect(parseExecParamsMock.getCall(0).args).toEqual([{
      ...params,
      exec: WRAP_EXEC_STUB,
    }]);
    expect(res).toBe(exepectedRes);
  });
});
