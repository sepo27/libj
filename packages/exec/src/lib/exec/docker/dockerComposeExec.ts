import { WrapExecParams } from '../../types';
import { ExecResponse } from '../exec';
import { wrapExec } from '../wrapExec';

export const dockerComposeExec = (...params: WrapExecParams): ExecResponse => wrapExec('docker-compose', ...params);
