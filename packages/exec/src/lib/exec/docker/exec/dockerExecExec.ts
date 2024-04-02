import { DockerExecExecParams } from './types';
import { parseDockerExecExecParams } from './parseDockerExecExecParams';
import { dockerExec } from '../dockerExec';
import { DOCKER_EXEC_COMMAND } from './constants';
import { ExecResponse } from '../../exec';

export const dockerExecExec = (...params: DockerExecExecParams): ExecResponse => {
  const
    {
      container: inContainer,
      containerArgs,
      execOpts = [],
      dockerOpts,
      zxOpts: inZxOpts,
    } = parseDockerExecExecParams(params),
    zxOpts = { ...inZxOpts };

  let container = inContainer;

  if (container.indexOf('@~') === 0) {
    const containerName = container.substring(2);
    container = `$(docker ps -f "name=${containerName}" --format "{{.ID}}")`;
    zxOpts.allowSubScript = true;
  }

  return dockerExec({
    command: DOCKER_EXEC_COMMAND,
    commandOptsAndArgs: [...execOpts, container, ...containerArgs],
    execOpts: dockerOpts,
    zxOpts,
  });
};
