import * as path from 'path';
import { CliPath } from '../../../CliPath';
import { BundleDependencyInterface } from './BundleDependencyInterface';
import { LibBundleDependency } from './LibBundleDependency';
import { CommonBundleDependency } from './CommonBundleDependency';
import { NpmBundleDependency } from './NpmBundleDependency';

// TODO: fix esilnt

enum Type { // eslint-disable-line no-unused-vars, no-shadow
  LIB = 1, // eslint-disable-line no-unused-vars
  COMMON = 2, // eslint-disable-line no-unused-vars
  NPM = 3, // eslint-disable-line no-unused-vars
}

export const makeBundleDependency = (contextFile, importPath): BundleDependencyInterface => { // eslint-disable-line consistent-return
  const type = defineType(importPath);

  switch (type) {
    case Type.LIB:
      return new LibBundleDependency(contextFile, importPath);

    case Type.COMMON:
      return new CommonBundleDependency(contextFile, importPath);

    case Type.NPM:
      return new NpmBundleDependency(importPath);

    default:
      throw new Error(`Unknown bundle dependency type: ${type}`);
  }
};

/*** Private ***/

function defineType(importPath) {
  if (importPath.indexOf('./') < 0) {
    return Type.NPM;
  }

  const firstPart = importPath.split(path.sep).find(p => p.indexOf('.') < 0);
  if (firstPart === CliPath.Part.COMMON) {
    return Type.COMMON;
  }

  return Type.LIB;
}
