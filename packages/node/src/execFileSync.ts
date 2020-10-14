import { execFileSync as nodeExecFileSync } from 'child_process';

export const execFileSync = (file: string, args: string[] = []) => {
  try {
    return nodeExecFileSync(file, args).toString();
  } catch (e) {
    const finalMsg = `${e.message}\n${e.stdout.toString()}`;
    throw new Error(finalMsg);
  }
};
