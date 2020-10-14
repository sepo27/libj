import * as fs from 'fs-extra';
import { BundleDependency } from './BundleDependency';

const IMPORT_PATTERN = /require\((['"])(.*?)\1\)/g;

export class BundleModule {
  constructor(file: string) {
    this.file = file;
    this.content = fs.readFileSync(file).toString();
  }

  /*** Public ***/

  get dependencies() {
    if (this.$dependencies) { return this.$dependencies; }

    // TODO: refactor into matchAll()
    const imports = Array
      .from(
        // @ts-ignore: TODO upgrade ts ?
        this.content.matchAll(IMPORT_PATTERN), // eslint-disable-line quotes
      )
      .map(m => m[2]);

    return ( // eslint-disable-line no-return-assign
      this.$dependencies = imports.map((importPath: string) => new BundleDependency(this.file, importPath))
    );
  }

  get ownExternalDependencies(): BundleDependency[] {
    return this.dependencies.filter(d => !d.isNpm && d.isExternal);
  }

  public replaceDependency(d: BundleDependency) {
    this.content = this.content.replace(d.importPath, d.npmPath);
  }

  public flush() {
    fs.writeFileSync(this.file, this.content);
  }

  /*** Private ***/

  private file: string;
  private content: string;

  private $dependencies: BundleDependency[];
}
