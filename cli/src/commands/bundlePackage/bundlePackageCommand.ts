import { execFileSync } from '../../../../packages/node/src/execFileSync';
import { CliPath as P } from '../../CliPath';
import { debuggableCommand } from '../../../../packages/cli/src/debuggableCommand';
import { cliLogger } from '../../cliLogger';
import { BundlePackage } from './BundlePackage';

const logger = cliLogger();

const action = (packageName) => {
  logger.info('Bundling package: %s', packageName);

  logger.infoProgress('Compiling...done', () => {
    execFileSync('npx', ['tsc', '-p', P.package(packageName, 'tsconfig.json')]);
  });

  const bundlePackage = new BundlePackage(packageName);

  if (bundlePackage.distIsFlat) {
    logger.info('Dist is flat. Nothing to repack. Exit now.');
    return;
  }

  logger.infoProgress('Repacking...done', () => {
    const usedDependencies = {};

    bundlePackage.distModules.forEach(m => {
      m.dependencies.forEach(d => {
        if (d.isNpm || d.isExternal) {
          usedDependencies[d.npmPath] = true;
        }

        if (!d.isNpm && d.isExternal) {
          m.replaceDependency(d);
          bundlePackage.packageJson.addDependency(d);
        }
      });
    });

    bundlePackage.packageJson.dropUnusedDependencies(usedDependencies);

    bundlePackage.flush();
  });

  logger.info('Complete.');
};

export const bundlePackageCommand = debuggableCommand('pkg:bundle', action)
  .arguments('<name>');
