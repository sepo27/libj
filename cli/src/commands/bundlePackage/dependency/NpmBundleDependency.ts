import { BundleDependencyInterface } from './BundleDependencyInterface';

export class NpmBundleDependency implements BundleDependencyInterface {
  constructor(importPath: string) {
    this.importPath = importPath;
    this.packageName = importPath;
    this.npmPath = importPath;
  }

  readonly importPath: string;
  readonly packageName: string;
  readonly npmPath: string;
}
