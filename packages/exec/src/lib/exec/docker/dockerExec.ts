import { WrapExecParams } from '../../types';
import { ExecResponse } from '../exec';
import { wrapExec } from '../wrapExec';

export const dockerExec = (...args: WrapExecParams): ExecResponse => wrapExec('docker', ...args);
