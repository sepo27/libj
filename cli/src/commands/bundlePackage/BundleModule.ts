import * as fs from 'fs-extra';
import { BundleDependencyInterface } from './dependency/BundleDependencyInterface';
import { makeBundleDependency } from './dependency/makeBundleDependency';
import { LibBundleDependency } from './dependency/LibBundleDependency';

const IMPORT_PATTERN = /require\((['"])(.*?)\1\)/g;

export class BundleModule {
  constructor(file: string) {
    this.file = file;
    this.content = fs.readFileSync(file).toString();
  }

  /*** Public ***/

  get dependencies(): BundleDependencyInterface[] {
    if (this.$dependencies) { return this.$dependencies; }

    // TODO: refactor into matchAll()
    const imports = Array
      .from(
        // @ts-ignore: TODO upgrade ts ?
        this.content.matchAll(IMPORT_PATTERN), // eslint-disable-line quotes
      )
      .map(m => m[2]);

    return (
      this.$dependencies = imports.map(importPath => makeBundleDependency(this.file, importPath))
    );
  }

  public replaceLibDependency(d: LibBundleDependency) {
    this.content = this.content.replace(d.importPath, d.npmPath);
  }

  public flush() {
    fs.writeFileSync(this.file, this.content);
  }

  /*** Private ***/

  private file: string;
  private content: string;
  private $dependencies: BundleDependencyInterface[];
}
