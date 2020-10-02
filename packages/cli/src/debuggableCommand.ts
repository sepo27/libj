import { createCommand, Command } from 'commander';

// TODO: use from commander ?
// TODO: sort out eslint for types
type Action = (...args: any[]) => void | Promise<void>; // eslint-disable-line no-unused-vars

// TODO: return command

export const debuggableCommand = (name: string, action: Action) =>
  createCommand(name)
    .option('-d, --debug', 'Debug')
    .action((...args) => {
      const cli = args.find(a => a instanceof Command);

      try {
        action(...args);
      } catch (e) {
        if (cli.opts().debug) {
          throw e;
        } else {
          console.error(e.toString());
          process.exit(1);
        }
      }
    });
