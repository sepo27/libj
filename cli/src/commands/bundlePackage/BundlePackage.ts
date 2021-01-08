import * as glob from 'glob';
import * as fs from 'fs-extra';
import { CliPath } from '../../CliPath';
import { BundleModule } from './BundleModule';
import { BundlePackageJson } from './BundlePackageJson';
import { LibBundleDependency } from './dependency/LibBundleDependency';

export class BundlePackage {
  constructor(private name: string) {
    const distFiles = glob.sync(CliPath.packageDistSrc(name, '**/*.js'));

    this.distModules = distFiles.map(f => new BundleModule(f));
    this.packageJson = new BundlePackageJson(name);
  }

  /*** Public ***/

  public readonly distModules: BundleModule[];
  public readonly packageJson: BundlePackageJson;

  public get distIsFlat(): boolean {
    return !fs.existsSync(CliPath.packageDist(this.name, this.name));
  }

  public addLibDependency(d: LibBundleDependency) {
    this.packageJson.addDependency(d.npmPath, d.packageJson.version);
  }

  public flush() {
    this.distModules.forEach(m => {
      m.flush();
    });

    this.packageJson.write();

    this.flattenDist();
  }

  /*** Private ***/

  private flattenDist() {
    const tmpPath = CliPath.packageDistTmp(this.name);

    // Copy dist modules to temp
    fs.copySync(CliPath.packageDistSrc(this.name), tmpPath);

    // Drop nested structure
    const oldPaths = glob.sync(CliPath.packageDistTmpIgnore(this.name));
    oldPaths.forEach(p => {
      fs.removeSync(p);
    });

    // Unpack from temp
    fs.copySync(tmpPath, CliPath.packageDist(this.name));
    fs.removeSync(tmpPath);
  }
}
