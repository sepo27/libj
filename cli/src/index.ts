import { program as cli } from 'commander';
import { execCommand } from '../../packages/cli/src/execCommand';

const command = execCommand('foo', 'echo', ['Happy World']);
cli.addCommand(command);

cli.parse(process.argv);
