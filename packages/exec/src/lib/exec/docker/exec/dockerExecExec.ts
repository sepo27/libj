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
    const
      containerName = container.substring(2),
      containerParts = [
        'docker',
        'ps',
        '-f', `"name=${containerName}"`,
        '--format', '"{{.ID}}"',
      ];

    // When container match is done on remote (i.e. within some context)
    // it needs to preserve that context value
    let idx;
    if ((idx = dockerOpts?.indexOf('-c')) > -1) { // eslint-disable-line no-cond-assign
      const dockerContext = [...dockerOpts].splice(idx, 2);
      containerParts.splice(1, 0, ...dockerContext);
    }

    container = `$(${containerParts.join(' ')})`;
    zxOpts.allowSubScript = true;
  }

  return dockerExec({
    command: DOCKER_EXEC_COMMAND,
    commandOptsAndArgs: [...execOpts, container, ...containerArgs],
    execOpts: dockerOpts,
    zxOpts,
  });
};
