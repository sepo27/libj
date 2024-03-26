import { dockerExec } from './dockerExec';
import { ZxOpts } from '../../zx/ZxOpts';

interface Opts {
  searchContainer?: boolean
  verbose?: boolean
}

export const dockerExecExec = (containerName: string, command: string | string[], opts: Opts = {}) => {
  const
    containerPattern = opts.searchContainer
      ? `$(docker ps -f "name=${containerName}" --format "{{.ID}}")`
      : containerName,
    execCommand = Array.isArray(command) ? command : [command],
    execOpts: ZxOpts = { verbose: opts.verbose };

  if (opts.searchContainer) {
    execOpts.allowSubScript = true;
  }

  dockerExec('exec', ['-it', containerPattern, ...execCommand], execOpts);
};
