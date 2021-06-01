import * as path from 'path';
import { BundleDependencyInterface } from './BundleDependencyInterface';
import { CliPath } from '../../../CliPath';
import { makeLibjDepName } from '../makeLibjDepName';
import { BundlePackageJson } from '../BundlePackageJson';

export class LibBundleDependency implements BundleDependencyInterface {
  constructor(contextFile: string, importPath: string) {
    const { contextPackageName, packageName } = this.defineBaseProperties(contextFile, importPath);

    this.importPath = importPath;
    this.isExternal = contextPackageName !== packageName;
    this.packageName = packageName;
    this.npmPath = this.makeNpmPath(packageName);
    this.packageJson = new BundlePackageJson(packageName);
  }

  /*** Public ***/

  public readonly importPath: string;
  public readonly isExternal: boolean;
  public readonly packageName: string;
  public readonly npmPath: string;
  public readonly packageJson: BundlePackageJson;

  /*** Private ***/

  private defineBaseProperties(contextFile, importPath) {
    const
      contextPackageName = contextFile
        .replace(CliPath.rootPackages(path.sep), '')
        .split(path.sep)[0];

    const
      basePaths = [
        CliPath.packageDistPackages(contextPackageName),
        CliPath.packageDist(contextPackageName),
      ],
      ext = importPath.indexOf('.js') === -1 ? '.js' : '',
      absolutePath = path.resolve(path.dirname(contextFile), `${importPath}${ext}`),
      packageName = basePaths
        .reduce(
          (acc, p) => acc.replace(path.join(p, path.sep), ''),
          absolutePath,
        )
        .split(path.sep)[0];

    return { contextPackageName, packageName };
  }

  private makeNpmPath(packageName) {
    // TODO: use string.splitCamelCase() util fn
    return makeLibjDepName(packageName.split(/(?=[A-Z])/g).join('-').toLowerCase());
  }
}
