import { CliTBench } from '../../../../packages/cli/.spec/CliTBench';
import { bundlePackageCommand } from './bundlePackageCommand';
import { CliPath } from '../../CliPath';
import { BundlePackageCommandTBench } from './.spec/BundlePackageCommandTBench';

describe('bundlePackageCommand()', () => {
  let bench: CliTBench;

  beforeEach(() => {
    bench = new BundlePackageCommandTBench();
  });

  afterEach(() => {
    bench.reset();
  });

  it('runs typescript compiler for package', () => {
    const packageName = 'foo';

    bench.mock.package(packageName);

    bench.action.run(bundlePackageCommand, ['foo', '-d']);

    expect(bench.mock.execFileSync.calledOnce).toBeTruthy();
    expect(bench.mock.execFileSync.getCall(0).args).toEqual([
      'npx',
      ['tsc', '-p', CliPath.package(packageName, 'tsconfig.json')],
    ]);
  });

  it('rewrites external package dependency', () => {
    const
      packageName = 'foo',
      fooFile = 'foo.js',
      files = {
        [fooFile]: `
          const { bar } = require('../../bar/src/barMyFoo');
          
          // Code ...
        `,
      },
      dependencies = { bar: {} };

    const { fileMap } = bench.mock.package(packageName, { files, dependencies });

    const rewriteContent = `
          const { bar } = require('@libj/bar');
          
          // Code ...
        `;

    bench.action.run(bundlePackageCommand, [packageName, '-d']);

    expect(bench.mock.fs.writeFileSync.calledOnce).toBeTruthy();
    expect(bench.mock.fs.writeFileSync.getCall(0).args).toEqual([
      fileMap[fooFile],
      rewriteContent,
    ]);
  });

  it('rewrites some external package dependencies', () => {
    const
      packageName = 'abc',
      indexFile = 'index.js',
      files = {
        [indexFile]: `
          const { foo } = require('../../foo/src/theFoo');
          const { fox } = require('./fox');
          const { bar } = require('../../bar/src/bar.js');
          const { bbb } = require('./bbb/index.js');

          // Code ...
        `,
      },
      dependencies = {
        foo: {},
        bar: {},
      };

    const { fileMap } = bench.mock.package(packageName, { files, dependencies });

    const rewriteContent = `
          const { foo } = require('@libj/foo');
          const { fox } = require('./fox');
          const { bar } = require('@libj/bar');
          const { bbb } = require('./bbb/index.js');

          // Code ...
        `;

    bench.action.run(bundlePackageCommand, [packageName, '-d']);

    expect(bench.mock.fs.writeFileSync.calledOnce).toBeTruthy();
    expect(bench.mock.fs.writeFileSync.getCall(0).args).toEqual([
      fileMap[indexFile],
      rewriteContent,
    ]);
  });

  it('adds external dependencies to package json', () => {
    const
      packageName = 'xyz',
      files = {
        'index.js': `
          const { bar } = require('../../bar/src/bar.js');

          // Code ...
        `,
      },
      packageJson = {
        version: '0.0.0',
        dependencies: {},
      },
      barPackageVersion = '1.0.0',
      dependencies = {
        bar: {
          packageJson: {
            version: barPackageVersion,
          },
        },
      };

    bench.mock.package(packageName, {
      files,
      packageJson,
      dependencies,
    });

    const nextPackageJson = {
      ...packageJson,
      dependencies: {
        '@libj/bar': barPackageVersion,
      },
    };

    bench.action.run(bundlePackageCommand, [packageName, '-d']);

    expect(bench.mock.fs.writeJsonSync.calledOnce).toBeTruthy();
    expect(bench.mock.fs.writeJsonSync.getCall(0).args).toEqual([
      CliPath.packageJson(packageName),
      nextPackageJson,
      { spaces: 2 },
    ]);
  });

  it("errors out if dependency package doesn't have a version", () => {
    const
      packageName = 'abc',
      files = {
        'index.js': `
          const { def } = require('../../def/src/def.js');

          // Code ...
        `,
      },
      dependencies = {
        def: {
          packageJson: {},
        },
      };

    bench.mock.package(packageName, {
      files,
      dependencies,
    });

    expect(
      () => bench.action.run(bundlePackageCommand, [packageName, '-d']),
    ).toThrow(new Error('Missing package version for package: def'));
  });

  it('flattens nested dist structure with dependencies', () => {
    const
      packageName = 'fox',
      files = {
        'fox.js': `
          const { foo } = require('../../foo/src/index.js');

          // Code ...
        `,
      },
      depName = 'foo',
      dependencies = {
        [depName]: {},
      },
      packageDistDepPath = CliPath.packageDist(packageName, depName);

    bench.mock.package(packageName, {
      files,
      dependencies,
    });

    bench.mock.glob.sync
      .withArgs(CliPath.packageDistIgnore(packageName))
      .returns([packageDistDepPath]);

    bench.action.run(bundlePackageCommand, [packageName, '-d']);

    // assert copy to tmp
    expect(bench.mock.fs.copySync.getCall(0).args).toEqual([
      CliPath.packageDistSrc(packageName),
      CliPath.packageDistTmp(packageName),
    ]);

    // assert drop dist structure
    expect(bench.mock.fs.removeSync.getCall(0).args).toEqual([
      packageDistDepPath,
    ]);

    // assert unpack from tmp
    expect(bench.mock.fs.copySync.getCall(1).args).toEqual([
      CliPath.packageDistTmp(packageName),
      CliPath.packageDist(packageName),
    ]);
    expect(bench.mock.fs.removeSync.getCall(1).args).toEqual([
      CliPath.packageDistTmp(packageName),
    ]);
  });

  it('skips repacking for flat dist', () => {
    const
      packageName = 'foo',
      files = {
        'foo.js': `
          const { bar } = require('./bar.js');

          // Code ...
        `,
      };

    bench.mock.package(packageName, {
      files,
    });

    bench.mock.fs.existsSync
      .withArgs(CliPath.packageDist(packageName, packageName))
      .returns(false);

    bench.action.run(bundlePackageCommand, [packageName, '-d']);

    expect(bench.mock.fs.writeFileSync.callCount).toBe(0);
  });

  it('leaves external npm dependencies as is', () => {
    const
      packageName = 'xyz',
      mainFile = 'index.js',
      files = {
        [mainFile]: `
          const { foo } = require('some');
          const { foxy } = require('../../foxy/index.js');
          const { bar } = require('@another/bar');

          // Code ...
        `,
      },
      dependencies = { foxy: {} };

    const { fileMap } = bench.mock.package(packageName, {
      files,
      dependencies,
    });

    const rewriteContents = `
          const { foo } = require('some');
          const { foxy } = require('@libj/foxy');
          const { bar } = require('@another/bar');

          // Code ...
        `;

    bench.action.run(bundlePackageCommand, [packageName, '-d']);

    expect(bench.mock.fs.writeFileSync.calledOnce).toBeTruthy();
    expect(bench.mock.fs.writeFileSync.getCall(0).args).toEqual([
      fileMap[mainFile],
      rewriteContents,
    ]);
  });

  it('sweeps out unused dependencies', () => {
    const
      packageName = 'foo',
      files = {
        'index.js': `
          const { bar } = require('../../bar/src/bar.js');

          // Code ...
        `,
      },
      packageJson = {
        version: '0.0.0',
        dependencies: {
          '@libj/baz': '1.2.3',
          fox: '3.4.5',
        },
      },
      barPackageVersion = '1.0.0',
      dependencies = {
        bar: {
          packageJson: {
            version: barPackageVersion,
          },
        },
      };

    bench.mock.package(packageName, {
      files,
      packageJson,
      dependencies,
    });

    const nextPackageJson = {
      ...packageJson,
      dependencies: {
        '@libj/bar': barPackageVersion,
      },
    };

    bench.action.run(bundlePackageCommand, [packageName, '-d']);

    expect(bench.mock.fs.writeJsonSync.calledOnce).toBeTruthy();
    expect(bench.mock.fs.writeJsonSync.getCall(0).args).toEqual([
      CliPath.packageJson(packageName),
      nextPackageJson,
      { spaces: 2 },
    ]);
  });

  // TODO: usecase: no longer have external / npm dependencies => remove from packageJson

  it('rewrites common dependency', () => {
    const
      packageName = 'fox',
      indexFile = 'index.js',
      files = {
        [indexFile]: `
          const { abc } = require('../../../common/foxy.js');

          // Code ...
        `,
      },
      rewriteContent = `
          const { abc } = require('./common/foxy.js');

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

  it('rewrites common dependency with nested src', () => {
    const
      packageName = 'fox',
      indexFile = '/and/rabbit.js',
      files = {
        [indexFile]: `
          const { abc } = require('../../../../common/foxy.js');

          // Code ...
        `,
      },
      rewriteContent = `
          const { abc } = require('../common/foxy.js');

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

  it('flattens dist with common code', () => {
    const
      packageName = 'bar',
      srcFile = 'index.js',
      files = {
        [srcFile]: `
          const { foxy } = require('../../../common/foxy.js');

          // Code ...
        `,
      },
      distPackagesPath = CliPath.packageDistPackages(packageName),
      distPackagesSrcPath = CliPath.packageDistPackagesSrc(packageName),
      distTmpPath = CliPath.packageDistTmp(packageName);

    bench.mock.package(packageName, {
      files,
      hasCommon: true,
    });

    bench.mock.glob.sync
      .withArgs(CliPath.packageDistIgnore(packageName))
      .returns([distPackagesPath]);

    bench.action.run(bundlePackageCommand, [packageName, '-d']);

    // assert copy to tmp
    expect(bench.mock.fs.copySync.getCall(0).args).toEqual([
      distPackagesSrcPath,
      distTmpPath,
    ]);

    // assert drop dist packages structure
    expect(bench.mock.fs.removeSync.getCall(0).args).toEqual([
      distPackagesPath,
    ]);

    // assert unpack from tmp
    expect(bench.mock.fs.copySync.getCall(1).args).toEqual([
      distTmpPath,
      CliPath.packageDist(packageName),
    ]);
    expect(bench.mock.fs.removeSync.getCall(1).args).toEqual([
      distTmpPath,
    ]);
  });
});
