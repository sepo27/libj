import { CliTBench } from '../.spec/CliTBench';
import { debuggableCommand } from './debuggableCommand';

describe('debugableCommand', () => {
  let bench: CliTBench;

  beforeEach(() => {
    bench = new CliTBench();
  });

  afterEach(() => {
    bench.reset();
  });

  it('errors to console by default', () => {
    const
      errorSpy = bench.sinon.stub(console, 'error'),
      processExitSpy = bench.sinon.stub(process, 'exit');

    const command = debuggableCommand('foo', () => { throw new Error('Oops, error'); });
    bench.action.run(command);

    expect(errorSpy.calledWith('Error: Oops, error')).toBeTruthy();
    expect(processExitSpy.calledWith(1)).toBeTruthy();
  });

  it('errors out with -d option', () => {
    const command = debuggableCommand('bar', () => { throw new Error('Test error'); });

    expect(() => bench.action.run(command, ['-d']))
      .toThrowError(new Error('Test error'));
  });

  it('passes command arguments through', () => {
    const
      actionSpy = bench.sinon.spy(),
      command = debuggableCommand('baz', actionSpy).arguments('<a> <b>');

    bench.action.run(command, ['a', 'b']);

    expect(actionSpy.calledOnce).toBeTruthy();

    const [a, b] = actionSpy.getCall(0).args;
    expect([a, b]).toEqual(['a', 'b']);
  });

  it('passes command options through', () => {
    const
      actionSpy = bench.sinon.spy(),
      command = debuggableCommand('baz', ({ foo }) => actionSpy(foo))
        .option('--foo <val>', 'Foo option');

    bench.action.run(command, ['--foo', 'my foo']);

    expect(actionSpy.calledOnce).toBeTruthy();
    expect(actionSpy.getCall(0).firstArg).toEqual('my foo');
  });

  // TODO: double check the test
  it('handles async action', () => {
    const
      actionSpy = bench.sinon.spy(),
      command = debuggableCommand('foxy', () => new Promise(resolve => {
        actionSpy('Async foo');
        resolve();
      }));

    bench.action.run(command);

    expect(actionSpy.calledOnce).toBeTruthy();
    expect(actionSpy.getCall(0).firstArg).toEqual('Async foo');
  });
});
