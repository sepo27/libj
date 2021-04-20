import { CliTBench } from '../../../../packages/cli/.spec/CliTBench';
import { bundlePackageCommand } from './bundlePackageCommand';
import { BundlePackageCommandTBench } from './@spec/BundlePackageCommandTBench';

describe('bundlePackageCommand()', () => {
  let bench: CliTBench;

  beforeEach(() => {
    bench = new BundlePackageCommandTBench();
  });

  afterEach(() => {
    bench.reset();
  });

  it('rewrites external package dependency for ts file', () => {
    const
      packageName = 'foo',
      indexFile = 'index.d.ts',
      files = {
        [indexFile]: `
          import { Bar } from '../../bar/src/bar';

          // Code ...
        `,
      },
      dependencies = { bar: {} };

    const { fileMap } = bench.mock.package(packageName, { files, dependencies });

    const rewriteContent = `
          import { Bar } from '@libj/bar';

          // Code ...
        `;

    bench.action.run(bundlePackageCommand, [packageName, '-d']);

    expect(bench.mock.fs.writeFileSync.calledOnce).toBeTruthy();
    expect(bench.mock.fs.writeFileSync.getCall(0).args).toEqual([
      fileMap[indexFile],
      rewriteContent,
    ]);
  });

  it('preserves ts files paths from same package', () => {
    const
      packageName = 'foo',
      indexFile = 'index.d.ts',
      files = {
        [indexFile]: `
          import { Bar } from './bar/bar';

          // Code ...
        `,
      },
      dependencies = { bar: {} };

    const { fileMap } = bench.mock.package(packageName, { files, dependencies });

    const rewriteContent = `
          import { Bar } from './bar/bar';

          // Code ...
        `;

    bench.action.run(bundlePackageCommand, [packageName, '-d']);

    expect(bench.mock.fs.writeFileSync.calledOnce).toBeTruthy();
    expect(bench.mock.fs.writeFileSync.getCall(0).args).toEqual([
      fileMap[indexFile],
      rewriteContent,
    ]);
  });

  it('rewrites common ts dependency', () => {
    const
      packageName = 'fox',
      indexFile = 'index.d.ts',
      files = {
        [indexFile]: `
          import { abc } from '../../../common/foxy';

          // Code ...
        `,
      },
      rewriteContent = `
          import { abc } from './common/foxy';

          // Code ...
        `;

    const { fileMap } = bench.mock.package(packageName, {
      files,
      hasCommon: true,
    });

    bench.action.run(bundlePackageCommand, [packageName, '-d']);

    expect(bench.mock.fs.writeFileSync.calledOnce).toBeTruthy();
    expect(bench.mock.fs.writeFileSync.getCall(0).args).toEqual([
      fileMap[indexFile],
      rewriteContent,
    ]);
  });
});
