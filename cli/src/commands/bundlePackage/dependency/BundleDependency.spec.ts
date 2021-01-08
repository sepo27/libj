import { CliPath } from '../../../CliPath';
import { BundlePackageCommandTBench } from '../.spec/BundlePackageCommandTBench';
import { makeBundleDependency } from './makeBundleDependency';
import { LibBundleDependency } from './LibBundleDependency';
import { CommonBundleDependency } from './CommonBundleDependency';
import { makeLibjDepName } from '../makeLibjDepName';
import { NpmBundleDependency } from './NpmBundleDependency';
import { BundlePackageJson } from '../BundlePackageJson';

describe('BundleDependency', () => {
  let bench: BundlePackageCommandTBench;

  beforeEach(() => {
    bench = new BundlePackageCommandTBench();
    bench.mock.fs.readJsonSync; // eslint-disable-line no-unused-expressions
  });

  afterEach(() => {
    bench.reset();
  });

  it('resolves lib dependency', () => {
    const d = make(
      CliPath.packageDistSrc('foo', 'index.js'),
      './bar.js',
    );

    expect(d).toBeInstanceOf(LibBundleDependency);
  });

  it('resolves lib dependency import path', () => {
    const d = make(
      CliPath.packageDistSrc('bar', 'bar.js'),
      './foo.js',
    );

    expect(d.importPath).toBe('./foo.js');
  });

  it('resolves lib dependency is not external', () => {
    const d = make(
      CliPath.packageDistSrc('baz', 'index.js'),
      './barrrrr.js',
    ) as LibBundleDependency;

    expect(d.isExternal).toBeFalsy();
  });

  it('resolves lib dependency is external', () => {
    const d = make(
      CliPath.packageDistSrc('the', 'index.js'),
      '../../foo/src/foo.js',
    ) as LibBundleDependency;

    expect(d.isExternal).toBeTruthy();
  });

  it('resolves lib dependency packageName for internal', () => {
    const d = make(
      CliPath.packageDistSrc('foo', 'index.js'),
      './bar.js',
    ) as LibBundleDependency;

    expect(d.packageName).toBe('foo');
  });

  it('resolves lib dependency packageName for external', () => {
    const d = make(
      CliPath.packageDistSrc('bar', 'bar.js'),
      '../../bazzz/src/bazzz.js',
    ) as LibBundleDependency;

    expect(d.packageName).toBe('bazzz');
  });

  it('resolves lib dependency npmPath for internal', () => {
    const d = make(
      CliPath.packageDistSrc('foo', 'index.js'),
      './bar.js',
    ) as LibBundleDependency;

    expect(d.npmPath).toBe(makeLibjDepName('foo'));
  });

  it('resolves lib dependency npmPath for external', () => {
    const d = make(
      CliPath.packageDistSrc('foo', 'index.js'),
      '../../bar/src/bar.js',
    ) as LibBundleDependency;

    expect(d.npmPath).toBe(makeLibjDepName('bar'));
  });

  it('resolves lib dependency package json', () => {
    const readJsonSpy = bench.mock.fs.readJsonSync;

    const d = make(
      CliPath.packageDistSrc('foo', 'index.js'),
      '../../bar/src/bar.js',
    ) as LibBundleDependency;

    expect(d.packageJson).toBeInstanceOf(BundlePackageJson);
    expect(readJsonSpy.calledOnce).toBeTruthy();
    expect(readJsonSpy.getCall(0).args).toEqual([CliPath.packageJson('bar')]);
  });

  it('resolves common dependency', () => {
    const d = make(
      CliPath.packageDistPackagesSrc('foo', 'index.js'),
      '../../../common/bazzz.js',
    );

    expect(d).toBeInstanceOf(CommonBundleDependency);
  });

  it('resolves common dependency import path', () => {
    const d = make(
      CliPath.packageDistPackagesSrc('bar', 'bar.js'),
      '../../../common/baz.js',
    ) as CommonBundleDependency;

    expect(d.importPath).toBe('../../../common/baz.js');
  });

  it('resolves common dependency replace path', () => {
    const d = make(
      CliPath.packageDistPackagesSrc('fox', 'index.js'),
      '../../../common/abc.js',
    ) as CommonBundleDependency;

    expect(d.replacePath).toBe('./common/abc.js');
  });

  it('resolves common dependency replace path #2', () => {
    const d = make(
      CliPath.packageDistPackagesSrc('fox', '/and/rabbit.js'),
      '../../../../common/abc.js',
    ) as CommonBundleDependency;

    expect(d.replacePath).toBe('../common/abc.js');
  });

  it('resolves npm dependency', () => {
    const d = make(
      CliPath.packageDistPackagesSrc('foo', 'index.js'),
      'bar',
    );

    expect(d).toBeInstanceOf(NpmBundleDependency);
  });

  it('resolves npm dependency with scoped name', () => {
    const d = make(
      CliPath.packageDistPackagesSrc('foo', 'index.js'),
      '@bar/baz',
    );

    expect(d).toBeInstanceOf(NpmBundleDependency);
  });

  it('resolves npm dependency import path', () => {
    const d = make(
      CliPath.packageDistPackagesSrc('foo', 'index.js'),
      '@bar/baz',
    ) as NpmBundleDependency;

    expect(d.importPath).toBe('@bar/baz');
  });

  it('resolves npm dependency package name', () => {
    const d = make(
      CliPath.packageDistPackagesSrc('bar', 'index.js'),
      'baz',
    ) as NpmBundleDependency;

    expect(d.packageName).toBe('baz');
  });

  it('resolves npm dependency package name with scoped name', () => {
    const d = make(
      CliPath.packageDistPackagesSrc('foo', 'index.js'),
      '@baz/bar',
    ) as NpmBundleDependency;

    expect(d.packageName).toBe('@baz/bar');
  });

  it('resolves npm dependency npm path', () => {
    const d = make(
      CliPath.packageDistPackagesSrc('foo', 'index.js'),
      '@baz/bar',
    ) as NpmBundleDependency;

    expect(d.npmPath).toBe('@baz/bar');
  });
});

/*** Private ***/

function make(contextFile, importPath) {
  return makeBundleDependency(contextFile, importPath);
}
