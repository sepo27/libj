import { ZxOpts } from '../zx/ZxOpts';

export type ListExecParams =
/*** <exec> [command] ... ***/
  [string]
  | [string, string]
  | [string, string, string[]]
  | [string, string, ZxOpts]
  | [string, string, string[], ZxOpts]

  /*** <exec> [...execOpts] ... ***/
  | [string, string[]]
  | [string, string[], string]
  | [string, string[], string, string[]]
  | [string, string[], ZxOpts]
  | [string, string[], string, ZxOpts]
  | [string, string[], string, string[], ZxOpts];

export interface StructExecParams {
  exec: string
  execOpts: string[]
  command: string
  commandOptsAndArgs: string[]
  zxOpts: ZxOpts
}

export interface PartialStructExecParams extends Partial<StructExecParams> {
  exec: string
}

export type ExecParams = ListExecParams | [PartialStructExecParams];

export type ListWrapExecParams = [string]
  | [string, string[]]
  | [string[], string]
  | [string, ZxOpts]
  | [string, string[], ZxOpts]
  | [string[], string, string[]]
  | [string[], string, string[], ZxOpts]
  | [string[], string, ZxOpts]
  | [string[]]
  | [string[], ZxOpts];

export type StructWrapExecParams = Partial<Omit<StructExecParams, 'exec'>>;

export type WrapExecParams = ListWrapExecParams | [StructWrapExecParams];
