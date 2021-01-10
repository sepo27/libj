import * as path from 'path';

const ROOT = __dirname.split(`cli${path.sep}`)[0];

export const CliPath = {
  /*** Parts ***/

  Part: {
    PACKAGES: 'packages',
    SRC: 'src',
    DIST: 'dist',
    COMMON: 'common',
    TMP: '.tmp',
    PACKAGE_JSON: 'package.json',
  },

  /*** Accessories ***/

  root(...parts: string[]): string { return path.join(ROOT, ...parts); },
  rootPackages(...parts: string[]): string { return this.root(this.Part.PACKAGES, ...parts); },
  package(name, ...parts) { return this.rootPackages(name, ...parts); },
  packageDist(name, ...parts) { return this.package(name, this.Part.DIST, ...parts); },
  packageDistSrc(name, ...parts) { return this.packageDist(name, name, this.Part.SRC, ...parts); },
  packageDistTmp(name, ...parts) { return this.packageDist(name, this.Part.TMP, ...parts); },
  packageDistIgnore(name) {
    return this.packageDist(name, `!(${this.Part.TMP}|${this.Part.COMMON})`);
  },
  packageDistPackages(name, ...parts) { return this.packageDist(name, this.Part.PACKAGES, ...parts); },
  packageDistPackagesSrc(name, ...parts) {
    return this.packageDist(name, this.Part.PACKAGES, name, this.Part.SRC, ...parts);
  },
  packageJson(name) { return this.package(name, this.Part.PACKAGE_JSON); },
};
