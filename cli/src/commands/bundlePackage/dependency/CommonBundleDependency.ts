import * as path from 'path';
import { BundleDependencyInterface } from './BundleDependencyInterface';
import { CliPath } from '../../../CliPath';

const
  DirLevelsPattern = /(?:\.\.\/)+/,
  THIS_DIR_LEVEL = './',
  UPPER_DIR_LEVEL = '../',
  DIR_LEVEL_SHIFT = 3;

export class CommonBundleDependency implements BundleDependencyInterface {
  constructor(contextFile: string, importPath: string) {
    this.importPath = importPath;

    this.replacePath = importPath.replace(
      DirLevelsPattern,
      this.defineReplaceDirLevels(contextFile),
    );
  }

  /*** Public ***/

  readonly importPath: string;
  readonly replacePath: string;

  /*** Private ***/

  private defineReplaceDirLevels(contextFile) {
    let
      [dir, dirname] = this.basedir(contextFile),
      n = 0;

    while (dirname && dirname !== CliPath.Part.DIST) {
      n++;
      ([dir, dirname] = this.basedir(dir));
    }

    const levelCount = n - DIR_LEVEL_SHIFT;

    return levelCount > 0
      ? Array(levelCount).fill(UPPER_DIR_LEVEL).join('')
      : THIS_DIR_LEVEL;
  }

  private basedir(p) {
    const
      dir = path.dirname(p),
      dirname = path.basename(dir);

    return [dir, dirname];
  }
}
