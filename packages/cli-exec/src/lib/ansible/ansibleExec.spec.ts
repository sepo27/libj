import { CliExecTBench } from '../../../@spec/bench/CliExecTBench';
import { ansibleExec } from './ansibleExec';

describe('ansibleExec', () => {
  let bench: CliExecTBench;

  beforeEach(() => {
    bench = new CliExecTBench();
    bench.mock.zxec;
  });

  afterEach(() => {
    bench.restore();
  });

  it('runs with pattern', () => {
    ansibleExec('foo-pat');
    bench.assert.zxecCall('ansible', ['foo-pat']);
  });

  it('runs with pattern and opts', () => {
    ansibleExec('foo-pat', ['-a', '-b']);
    bench.assert.zxecCall('ansible', ['foo-pat', '-a', '-b']);
  });

  it('runs with pattern and zx opts', () => {
    ansibleExec('bar', { verbose: false });
    bench.assert.zxecCall('ansible', ['bar'], { verbose: false });
  });

  it('runs with pattern, opts and zx opts', () => {
    ansibleExec('bar', ['-f', '-n'], { verbose: false });
    bench.assert.zxecCall('ansible', ['bar', '-f', '-n'], { verbose: false });
  });

  it('resolves with zexc response', () => {
    const res = { abc: 'bar' };
    bench.mock.zxec.resolves(res);

    return expect(ansibleExec('baz')).resolves.toBe(res);
  });
});
