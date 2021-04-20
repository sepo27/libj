import * as fs from 'fs-extra';
import { BundleDependencyInterface } from './dependency/BundleDependencyInterface';
import { makeBundleDependency } from './dependency/makeBundleDependency';
import { LibBundleDependency } from './dependency/LibBundleDependency';
import { CommonBundleDependency } from './dependency/CommonBundleDependency';

const
  RequirePattern = /require\((['"])(.*?)\1\)/g,
  ImportPattern = /import.*?from\s*(['"])([^'"]*)\1/g;

export class BundleModule {
  constructor(file: string) {
    this.file = file;
    this.content = fs.readFileSync(file).toString();
  }

  /*** Public ***/

  get dependencies(): BundleDependencyInterface[] {
    if (this.$dependencies) { return this.$dependencies; }

    // TODO: refactor into matchAll()
    let imports = Array
      .from(
        // @ts-ignore: TODO upgrade ts ?
        this.content.matchAll(RequirePattern),
      )
      .map(m => m[2]);

    imports = imports.concat(
      Array
        .from(
          // @ts-ignore: TODO upgrade ts ?
          this.content.matchAll(ImportPattern),
        )
        .map(m => m[2]),
    );

    return (
      this.$dependencies = imports.map(importPath => makeBundleDependency(this.file, importPath))
    );
  }

  public replaceLibDependency(d: LibBundleDependency) {
    this.content = this.content.replace(d.importPath, d.npmPath);
  }

  public replaceCommonDependency(d: CommonBundleDependency) {
    this.content = this.content.replace(d.importPath, d.replacePath);
  }

  public flush() {
    fs.writeFileSync(this.file, this.content);
  }

  /*** Private ***/

  private file: string;
  private content: string;
  private $dependencies: BundleDependencyInterface[];
}
