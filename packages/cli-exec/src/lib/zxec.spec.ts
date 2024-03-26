import { CliExecTBench } from '../../@spec/bench/CliExecTBench';
import { zxec } from './zxec';

describe('zxec()', () => {
  let bench: CliExecTBench;

  beforeEach(() => {
    bench = new CliExecTBench();
    bench.mock.zx;
    bench.mock.zxOpts();
  });

  afterEach(() => {
    bench.restore();
  });

  it('execs command', () => {
    zxec('echo');
    bench.assert.zxCall('echo');
  });

  it('execs command with args', () => {
    zxec('echo', ['foo', 'bar']);
    bench.assert.zxCall(['echo', 'foo', 'bar']);
  });

  it('execs command with zx opts', () => {
    zxec('docker', { verbose: false });
    bench.assert.zxCall('docker');
    bench.assert.zxOpts({ verbose: false });
  });

  // TODO
  xit('execs command disabling quote of sub-script', () => {});

  it('execs command with args and zx opts', () => {
    zxec('docker', ['-v'], { verbose: false });
    bench.assert.zxCall(['docker', '-v']);
    bench.assert.zxOpts({ verbose: false });
  });

  it('errors for invalid args', () => {
    // @ts-ignore
    expect(() => zxec('foo', 'bar', 'baz')).toThrow(new Error('Invalid zxec args given'));
  });

  it('resolves with zx result', () => {
    const res = { foo: 'barrr' };
    bench.mock.zx.resolves(res);

    return expect(zxec('dummy')).resolves.toEqual(res);
  });

  it('defaults to verbose false for zx opts', () => {
    [
      ['foo'],
      ['foo', ['bar']],
    ].forEach(args => {
      // @ts-ignore
      zxec(...args);
      bench.assert.zxOpts({ verbose: false });
    });
  });
});
