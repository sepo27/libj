import * as fs from 'fs';
import { spawn } from 'child_process';

export const _fooModuleMock = () => fs.readlinkSync('');
export const _barModuleMock = () => spawn('');
