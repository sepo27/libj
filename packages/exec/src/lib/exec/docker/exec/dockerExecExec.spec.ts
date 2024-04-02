import { ExecTBench } from '../../../../../@spec/bench/ExecTBench';
import * as DockerExecModule from '../dockerExec';
import { DOCKER_EXEC_COMMAND } from './constants';
import { dockerExecExec } from './dockerExecExec';
import { ListDockerExecExecParams } from './types';

describe('dockerExecExec()', () => {
  let bench: ExecTBench, dockerExecMock;

  beforeEach(() => {
    bench = new ExecTBench();
    dockerExecMock = bench.mock.sinon.stub(DockerExecModule, 'dockerExec');
  });

  afterEach(() => {
    bench.restore();
  });

  it('passes docker exec params as is from list params', () => {
    const params = [['-D'], ['-it', 'foo_run_444556677'], ['ls'], { verbose: true }];

    dockerExecExec(...params as ListDockerExecExecParams);

    expect(dockerExecMock.callCount).toBe(1);
    expect(dockerExecMock.getCall(0).args).toEqual([{
      execOpts: ['-D'],
      command: DOCKER_EXEC_COMMAND,
      commandOptsAndArgs: ['-it', 'foo_run_444556677', 'ls'],
      zxOpts: { verbose: true },
    }]);
  });

  it('handles container name match from list params', () => {
    const
      containerName = 'bar_run',
      container = `@~${containerName}`;

    dockerExecExec(container, 'ls');

    expect(dockerExecMock.callCount).toBe(1);
    expect(dockerExecMock.getCall(0).args).toMatchObject([{
      commandOptsAndArgs: [
        `$(docker ps -f "name=${containerName}" --format "{{.ID}}")`,
        'ls',
      ],
      zxOpts: { allowSubScript: true },
    }]);
  });

  it('handles container name match from struct params', () => {
    const
      containerName = 'abc_xyz.1',
      container = `@~${containerName}`;

    dockerExecExec({
      container,
      containerArgs: ['ls'],
    });

    expect(dockerExecMock.callCount).toBe(1);
    expect(dockerExecMock.getCall(0).args).toMatchObject([{
      commandOptsAndArgs: [
        `$(docker ps -f "name=${containerName}" --format "{{.ID}}")`,
        'ls',
      ],
      zxOpts: { allowSubScript: true },
    }]);
  });

  it('resolves with response from docker exec', () => {
    const expectedRes = { res: 'is' };

    dockerExecMock.returns(expectedRes);

    const res = dockerExecExec('foo', 'bar');

    expect(res).toBe(expectedRes);
  });
});
