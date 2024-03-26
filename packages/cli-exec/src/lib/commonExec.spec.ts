import { CliExecTBench } from '../../@spec/bench/CliExecTBench';
import { commonExec } from './commonExec';

describe('commonExec()', () => {
  let bench: CliExecTBench;

  beforeEach(() => {
    bench = new CliExecTBench();
    bench.mock.zxec;
  });

  afterEach(() => {
    bench.restore();
  });

  it('runs with exec only', () => {
    commonExec('foo');
    bench.assert.zxecCall('foo');
  });

  it('runs with exec and command', () => {
    commonExec('docker', 'config');
    bench.assert.zxecCall('docker', ['config']);
  });

  it('runs with exec, command and args', () => {
    commonExec('docker', 'ps', ['-a']);
    bench.assert.zxecCall('docker', ['ps', '-a']);
  });

  it('runs with exec, command and zx opts', () => {
    commonExec('docker', 'config', { verbose: false });
    bench.assert.zxecCall('docker', ['config'], { verbose: false });
  });

  it('runs with exec, command, args and zx opts', () => {
    commonExec('docker', 'ps', ['--ports'], { verbose: false });
    bench.assert.zxecCall('docker', ['ps', '--ports'], { verbose: false });
  });

  it('runs with exec and opts', () => {
    commonExec('docker', ['-v']);
    bench.assert.zxecCall('docker', ['-v']);
  });

  it('runs with exec, opts and command', () => {
    commonExec('docker', ['-c', 'foo'], 'config');
    bench.assert.zxecCall('docker', ['-c', 'foo', 'config']);
  });

  it('runs with exec, opts, command and args', () => {
    commonExec('docker', ['-c', 'bar'], 'ps', ['-a']);
    bench.assert.zxecCall('docker', ['-c', 'bar', 'ps', '-a']);
  });

  it('runs with exec, opts, command and zx opts', () => {
    commonExec('docker', ['-c', 'abc'], 'ps', { verbose: false });
    bench.assert.zxecCall('docker', ['-c', 'abc', 'ps'], { verbose: false });
  });

  it('runs with exec, opts, command, args and zx opts', () => {
    commonExec('docker', ['-c', 'xyz'], 'ps', ['-a', '--ports'], { verbose: false });
    bench.assert.zxecCall('docker', ['-c', 'xyz', 'ps', '-a', '--ports'], { verbose: false });
  });

  it('runs with exec, opts and zx opts', () => {
    commonExec('docker', ['-v'], { verbose: false });
    bench.assert.zxecCall('docker', ['-v'], { verbose: false });
  });

  it('errors out for invalid args', () => {
    // @ts-ignore
    expect(() => commonExec('foo', 'baz', 'xyz')).toThrow(new Error('Invalid commonExec args given'));
  });

  it('resolves with zxec response', () => {
    const res = { the: 'res' };
    bench.mock.zxec.resolves(res);

    return expect(commonExec('dummy')).resolves.toEqual(res);
  });
});
