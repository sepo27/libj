import { ZxOpts } from '../zx/ZxOpts';

export type CommonExecWrapParams =
  [string]
  | [string, string[]]
  | [string[], string]
  | [string, ZxOpts]
  | [string, string[], ZxOpts]
  | [string[], string, string[]]
  | [string[], string, string[], ZxOpts]
  | [string[], string, ZxOpts]
  | [string[]]
  | [string[], ZxOpts];
