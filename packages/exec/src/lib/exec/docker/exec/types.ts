import { ZxOpts } from '../../../../zx/ZxOpts';

export type ListDockerExecExecParams =
  [string, string]
  | [string, string[]]
  | [string[], string]
  | [string[], string[]]
  | [string[], string, string]
  | [string[], string, string[]]
  | [string[], string[], string]
  | [string, string, ZxOpts]
  | [string, string[], ZxOpts]
  | [string[], string, ZxOpts]
  | [string[], string[], ZxOpts]
  | [string[], string[], string, ZxOpts];

export type StructDockerExecExecParams = {
  container: string,
  containerArgs: string[],
  execOpts: string[],
  dockerOpts: string[],
  zxOpts: ZxOpts,
};

export interface PartialStructDockerExecExecParams extends Partial<StructDockerExecExecParams> {
  container: string
  containerArgs: string[]
}

export type DockerExecExecParams = ListDockerExecExecParams | [PartialStructDockerExecExecParams]
