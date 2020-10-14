import { program as cli } from 'commander';
import { bundlePackageCommand } from './commands/bundlePackage/bundlePackageCommand';

cli.addCommand(bundlePackageCommand);

cli.parse(process.argv);
