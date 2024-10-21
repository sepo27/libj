import { program as cli } from 'commander';
import { bundlePackageCommand } from './commands/bundlePackage/bundlePackageCommand';

// @ts-ignore: TODO
cli.addCommand(bundlePackageCommand);

cli.parse(process.argv);
