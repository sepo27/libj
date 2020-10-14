import * as path from 'path';
import { BundleDependency } from './BundleDependency';
import { makeLibjDepName } from './makeLibjDepName';
import { CliTBench } from '../../../../packages/cli/.spec/CliTBench';
import { BundlePackageCommandTBench } from './.spec/BundlePackageCommandTBench';
import { CliPath } from '../../CliPath';
import { BundlePackageJson } from './BundlePackageJson';

describe('BundleDependency', () => {
  let bench: CliTBench;

  beforeEach(() => {
    bench = new BundlePackageCommandTBench();
    bench.mock.CliPath.root.callsFake((...args) => path.join('/', ...args));
    bench.mock.fs.readJsonSync
      .withArgs(CliPath.packageJson('foo'))
      .returns({
        version: '0.0.0',
      });
  });

  afterEach(() => {
    bench.reset();
  });

  it('resolves is not npm for internal dependency', () => {
    const d = new BundleDependency(
      '/packages/foo/dist/foo/src/index.js',
      './bar.js',
    );

    expect(d.isNpm).toBeFalsy();
  });

  it('resolves is not npm for external dependency', () => {
    const d = new BundleDependency(
      '/packages/foo/dist/foo/src/index.js',
      '../../bar/bar.js',
    );

    expect(d.isNpm).toBeFalsy();
  });

  it('resolves import path', () => {
    const d = new BundleDependency(
      '/packages/foo/dist/foo/src/index.js',
      '../../bar/bar.js',
    );

    expect(d.importPath).toBe('../../bar/bar.js');
  });

  it('resolves package name', () => {
    const d = new BundleDependency(
      '/packages/fox/dist/fox/src/fox.js',
      '../../foo/index.js',
    );

    expect(d.packageName).toBe('foo');
  });

  it('resolves as external', () => {
    const d = new BundleDependency(
      '/packages/baz/dist/baz/src/file.js',
      '../../abc/abc.js',
    );

    expect(d.isExternal).toBeTruthy();
  });

  it('resolves as not external', () => {
    const d = new BundleDependency(
      '/packages/baz/dist/baz/src/file.js',
      './abc.js',
    );

    expect(d.isExternal).toBeFalsy();
  });

  it('resolves npm path for lib external dependency', () => {
    const d = new BundleDependency(
      '/packages/baz/dist/baz/src/file.js',
      '../../foo/foo.js',
    );

    expect(d.npmPath).toBe(makeLibjDepName('foo'));
  });

  it('resolves package.json', () => {
    const d = new BundleDependency(
      '/packages/baz/dist/baz/src/file.js',
      '../../foo/foo.js',
    );

    expect(d.packageJson).toBeInstanceOf(BundlePackageJson);
  });

  it('resolves is npm for npm dependency', () => {
    const d = new BundleDependency(
      '/packages/abc/dist/abc/src/index.js',
      'bar',
    );

    expect(d.isNpm).toBeTruthy();
  });

  it('resolves import path for npm dependency', () => {
    const d = new BundleDependency(
      '/packages/foo/dist/foo/src/index.js',
      'foo',
    );

    expect(d.importPath).toBe('foo');
  });

  it('resolves package name for npm dependency', () => {
    const d = new BundleDependency(
      '/packages/fox/dist/fox/src/fox.js',
      'foo',
    );

    expect(d.packageName).toBe('foo');
  });

  it('resolves package name for npm dependency with scope', () => {
    const d = new BundleDependency(
      '/packages/fox/dist/fox/src/fox.js',
      '@foo/bar',
    );

    expect(d.packageName).toBe('@foo/bar');
  });

  it('resolves is external for npm dependency', () => {
    const d = new BundleDependency(
      '/packages/cde/dist/cde/src/index.js',
      '@foo',
    );

    expect(d.isExternal).toBeTruthy();
  });

  it('resolves npm path for npm dependency', () => {
    const d = new BundleDependency(
      '/packages/bar/dist/bar/src/index.js',
      '@foo/bazz',
    );

    expect(d.npmPath).toBe('@foo/bazz');
  });

  it('errors out when accessing packageJson for npm dependency', () => {
    const d = new BundleDependency(
      '/packages/foo/dist/foo/src/index.js',
      '@bar',
    );

    expect(() => d.packageJson).toThrow(new Error('Unsupported property for npm dependency: packageJson'));
  });
});
