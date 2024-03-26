import { CommonExecWrapParams } from './types';
import { commonExec, CommonExecResponse } from './commonExec';

export const gitExec = (...args: CommonExecWrapParams): CommonExecResponse => commonExec('git', ...args);
