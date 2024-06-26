import { ExecTBench } from '../../../@spec/bench/ExecTBench';
import { exec } from './exec';

describe('commonExec()', () => {
  let bench: ExecTBench;

  beforeEach(() => {
    bench = new ExecTBench();
    bench.mock.zxec;
  });

  afterEach(() => {
    bench.restore();
  });

  it('runs with exec only', () => {
    exec('foo');
    bench.assert.zxecCall('foo');
  });

  it('runs with exec and command', () => {
    exec('docker', 'config');
    bench.assert.zxecCall('docker', ['config']);
  });

  it('runs with exec, command and args', () => {
    exec('docker', 'ps', ['-a']);
    bench.assert.zxecCall('docker', ['ps', '-a']);
  });

  it('runs with exec, command and zx opts', () => {
    exec('docker', 'config', { verbose: false });
    bench.assert.zxecCall('docker', ['config'], { verbose: false });
  });

  it('runs with exec, command, args and zx opts', () => {
    exec('docker', 'ps', ['--ports'], { verbose: false });
    bench.assert.zxecCall('docker', ['ps', '--ports'], { verbose: false });
  });

  it('runs with exec and opts', () => {
    exec('docker', ['-v']);
    bench.assert.zxecCall('docker', ['-v']);
  });

  it('runs with exec, opts and command', () => {
    exec('docker', ['-c', 'foo'], 'config');
    bench.assert.zxecCall('docker', ['-c', 'foo', 'config']);
  });

  it('runs with exec, opts, command and args', () => {
    exec('docker', ['-c', 'bar'], 'ps', ['-a']);
    bench.assert.zxecCall('docker', ['-c', 'bar', 'ps', '-a']);
  });

  it('runs with exec, opts, command and zx opts', () => {
    exec('docker', ['-c', 'abc'], 'ps', { verbose: false });
    bench.assert.zxecCall('docker', ['-c', 'abc', 'ps'], { verbose: false });
  });

  it('runs with exec, opts, command, args and zx opts', () => {
    exec('docker', ['-c', 'xyz'], 'ps', ['-a', '--ports'], { verbose: false });
    bench.assert.zxecCall('docker', ['-c', 'xyz', 'ps', '-a', '--ports'], { verbose: false });
  });

  it('runs with exec, opts and zx opts', () => {
    exec('docker', ['-v'], { verbose: false });
    bench.assert.zxecCall('docker', ['-v'], { verbose: false });
  });

  it('errors out for invalid args', () => {
    // @ts-ignore
    expect(() => exec('foo', 'baz', 'xyz')).toThrow(new Error('Invalid exec params given'));
  });

  it('resolves with zxec response', () => {
    const res = { the: 'res' };
    bench.mock.zxec.resolves(res);

    return expect(exec('dummy')).resolves.toEqual(res);
  });

  it('accepts struct exec params', () => {
    const params = {
      exec: 'docker',
      execOpts: ['-c', 'foo'],
      command: 'config',
      commandOptsAndArgs: ['create', 'bar'],
      zxOpts: { verbose: true },
    };

    exec(params);

    bench.assert.zxecCall('docker', ['-c', 'foo', 'config', 'create', 'bar'], { verbose: true });
  });
});
