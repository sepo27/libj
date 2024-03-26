import { CommonExecWrapParams } from '../types';
import { commonExec, CommonExecResponse } from '../commonExec';

export const dockerExec = (...args: CommonExecWrapParams): CommonExecResponse => commonExec('docker', ...args);
