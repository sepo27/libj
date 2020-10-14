import * as fs from 'fs-extra';
import { LooseObject, MapS } from '../../../../common/types';
import { CliPath } from '../../CliPath';
import { BundleDependency } from './BundleDependency';

export class BundlePackageJson {
  constructor(packageName: string) {
    this.packageName = packageName;

    this.filename = CliPath.packageJson(packageName);
    this.data = {
      dependencies: {},
      ...fs.readJsonSync(this.filename),
    };
  }

  /*** Public ***/

  public get version(): string {
    if (this.data.version) {
      return this.data.version;
    }
    throw new Error(`Missing package version for package: ${this.packageName}`);
  }

  public addDependency(d: BundleDependency) {
    this.data.dependencies[d.npmPath] = d.packageJson.version;
  }

  public dropUnusedDependencies(usedDependencies: MapS<string>) {
    Object.keys(this.data.dependencies).forEach(dNpmPath => {
      if (!usedDependencies[dNpmPath]) {
        delete this.data.dependencies[dNpmPath];
      }
    });
  }

  public write() {
    fs.writeJsonSync(this.filename, this.data, { spaces: 2 });
  }

  /*** Private ***/

  private filename: string;
  private packageName: string;
  private data: LooseObject;
}
