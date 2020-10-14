import * as path from 'path';
import { CliPath } from '../../CliPath';
import { makeLibjDepName } from './makeLibjDepName';
import { BundlePackageJson } from './BundlePackageJson';

export class BundleDependency {
  constructor(contextFile: string, importPath: string) {
    const
      ext = importPath.indexOf('.js') === -1 ? '.js' : '',
      absolutePath = path.resolve(path.dirname(contextFile), `${importPath}${ext}`),
      packageName = this.getPackageName(absolutePath);

    this.isNpm = importPath.indexOf('./') < 0;
    this.importPath = importPath;

    if (this.isNpm) {
      this.packageName = importPath;
      this.isExternal = true;
      this.npmPath = importPath;
    } else {
      this.packageName = packageName;
      this.isExternal = packageName !== this.getPackageName(contextFile);
      this.npmPath = makeLibjDepName(packageName);
    }
  }

  /*** Public ***/

  public readonly isNpm: boolean;
  public readonly importPath: string;
  public readonly packageName: string;
  public readonly isExternal: boolean;
  public readonly npmPath: string;

  public get packageJson(): BundlePackageJson {
    if (!this.isNpm) {
      if (this.$packageJson) {
        return this.$packageJson;
      }

      return (this.$packageJson = new BundlePackageJson(this.packageName));
    }

    throw new Error('Unsupported property for npm dependency: packageJson');
  }

  /*** Private ***/

  private $packageJson: BundlePackageJson;

  private getPackageName(absolutePath) {
    return absolutePath.split(`${CliPath.Part.DIST}${path.sep}`)[1].split(path.sep)[0];
  }
}
