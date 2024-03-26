import { CommonExecWrapParams } from '../types';
import { commonExec, CommonExecResponse } from '../commonExec';

export const dockerComposeExec = (...args: CommonExecWrapParams): CommonExecResponse =>
  commonExec('docker-compose', ...args);
