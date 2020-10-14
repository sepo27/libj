import * as path from 'path';

const ROOT = __dirname.split(`cli${path.sep}`)[0];

export const CliPath = {
  /*** Parts ***/

  Part: {
    SRC: 'src',
    DIST: 'dist',
    TMP: '.tmp',
    PACKAGE_JSON: 'package.json',
  },

  /*** Accessories ***/

  root(...parts: string[]): string { return path.join(ROOT, ...parts); },
  package(name, ...parts) { return this.root('packages', name, ...parts); },
  packageDist(name, ...parts) { return this.package(name, this.Part.DIST, ...parts); },
  packageDistSrc(name, ...parts) { return this.packageDist(name, name, this.Part.SRC, ...parts); },
  packageDistTmp(name, ...parts) { return this.packageDist(name, this.Part.TMP, ...parts); },
  packageDistTmpIgnore(name) { return this.packageDist(name, `!(${this.Part.TMP})`); },
  packageJson(name) { return this.package(name, this.Part.PACKAGE_JSON); },
};
