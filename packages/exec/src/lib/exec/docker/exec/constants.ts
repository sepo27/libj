import { StructDockerExecExecParams } from './types';

export const DefaultStructDockerExecExecParams: StructDockerExecExecParams = {
  container: undefined,
  containerArgs: undefined,
  execOpts: undefined,
  dockerOpts: undefined,
  zxOpts: undefined,
};

export const DOCKER_EXEC_COMMAND = 'exec';
