import { execFileSync } from 'child_process';
import { debuggableCommand } from './debuggableCommand';

export const execCommand = (name: string, exec: string, args: string[] = []) =>
  debuggableCommand(name, () => {
    const res = execFileSync(exec, args);
    console.log(res.toString());
  });
