import { execCommand } from './execCommand';
import { CliTBench } from '../.spec/CliTBench';

describe('execCommand()', () => {
  let bench: CliTBench;

  beforeEach(() => {
    bench = new CliTBench();
  });

  afterEach(() => {
    bench.reset();
  });

  it('executes simple command', () => {
    bench.sinon.stub(console, 'log');
    const execFileSpy = bench.mock.childProcess.execFileSync.returns('Happy day');

    bench.action.run(execCommand('foo', 'echo', ['Happy day']));

    expect(execFileSpy.calledOnce).toBeTruthy();
    expect(execFileSpy.getCall(0).args).toEqual(['echo', ['Happy day']]);
  });

  it('outputs command result', () => {
    bench.mock.childProcess.execFileSync.returns(Buffer.from('exec res'));
    const logSpy = bench.sinon.stub(console, 'log');

    bench.action.run(execCommand('bar', 'echo', ['barrr']));

    expect(logSpy.calledWith('exec res')).toBeTruthy();
  });
});
