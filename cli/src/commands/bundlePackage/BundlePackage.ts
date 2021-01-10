import * as glob from 'glob';
import * as fs from 'fs-extra';
import { CliPath } from '../../CliPath';
import { BundleModule } from './BundleModule';
import { BundlePackageJson } from './BundlePackageJson';
import { LibBundleDependency } from './dependency/LibBundleDependency';

export class BundlePackage {
  constructor(private name: string) {
    const
      hasCommon = fs.existsSync(CliPath.packageDist(name, CliPath.Part.COMMON)),
      distFilesPat = hasCommon
        ? CliPath.packageDistPackagesSrc(name, '**/*.js')
        : CliPath.packageDistSrc(name, '**/*.js'),
      distFiles = glob.sync(distFilesPat);

    this.hasCommon = hasCommon;
    this.distModules = distFiles.map(f => new BundleModule(f));
    this.packageJson = new BundlePackageJson(name);
  }

  /*** Public ***/

  public readonly distModules: BundleModule[];
  public readonly packageJson: BundlePackageJson;

  public get distIsFlat(): boolean {
    const checkPath = this.hasCommon
      ? CliPath.packageDistPackages(this.name)
      : CliPath.packageDist(this.name, this.name);

    return !fs.existsSync(checkPath);
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

  private hasCommon: boolean;

  private flattenDist() {
    const tmpPath = CliPath.packageDistTmp(this.name);

    // Copy dist modules to temp
    fs.copySync(this.distPlantedPath(this.name, CliPath.Part.SRC), tmpPath);

    // Drop nested structure
    const oldPaths = glob.sync(CliPath.packageDistIgnore(this.name));
    oldPaths.forEach(p => {
      fs.removeSync(p);
    });

    // Unpack from temp
    fs.copySync(tmpPath, CliPath.packageDist(this.name));
    fs.removeSync(tmpPath);
  }

  private distPlantedPath(...parts) {
    return this.hasCommon
      ? CliPath.packageDistPackages(this.name, ...parts)
      : CliPath.packageDist(this.name, ...parts);
  }
}
