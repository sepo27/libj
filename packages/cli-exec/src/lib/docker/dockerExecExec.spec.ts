import { CliExecTBench } from '../../../@spec/bench/CliExecTBench';
import * as DockerExecModule from './dockerExec';
import { dockerExecExec } from './dockerExecExec';

describe('dockerExecExec()', () => {
  let bench: CliExecTBench, dockerExecMock;

  beforeEach(() => {
    bench = new CliExecTBench();
    dockerExecMock = bench.mock.sinon.stub(DockerExecModule, 'dockerExec');
  });

  afterEach(() => {
    bench.restore();
  });

  it('execs container directly by name/ID by default', () => {
    const
      name = 'foo.1',
      command = 'bar';

    dockerExecExec(name, command);

    expect(dockerExecMock.callCount).toBe(1);
    expect(dockerExecMock.getCall(0).args).toEqual(['exec', ['-it', name, command], { verbose: undefined }]);
  });

  it('execs container searching by pattern', () => {
    const
      pattern = 'foo-bar-baz',
      command = 'aaabbbccc';

    dockerExecExec(pattern, command, { searchContainer: true });

    expect(dockerExecMock.callCount).toBe(1);
    expect(dockerExecMock.getCall(0).args).toEqual([
      'exec',
      [
        '-it',
        `$(docker ps -f "name=${pattern}" --format "{{.ID}}")`,
        command,
      ],
      { verbose: undefined, allowSubScript: true },
    ]);
  });

  it('execs array command', () => {
    const
      pattern = 'foo-container',
      command = ['foo', 'bar', 'baz'];

    dockerExecExec(pattern, command);

    expect(dockerExecMock.callCount).toBe(1);
    expect(dockerExecMock.getCall(0).args).toEqual(['exec', ['-it', pattern, ...command], { verbose: undefined }]);
  });

  it('minds verbose option', () => {
    dockerExecExec('foo', 'bar', { verbose: true });

    expect(dockerExecMock.callCount).toBe(1);
    expect(dockerExecMock.getCall(0).args[2]).toMatchObject({ verbose: true });
  });
});
