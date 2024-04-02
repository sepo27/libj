import { $, ProcessOutput, ProcessPromise } from 'zx';

// Wrapper for tests ...
export const zx = (pieces: TemplateStringsArray, ...args: any[]): ProcessPromise<ProcessOutput> => $(pieces, ...args);
