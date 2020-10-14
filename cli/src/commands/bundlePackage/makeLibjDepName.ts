import * as path from 'path';

const REPO_NAME = '@libj';

export const makeLibjDepName = (packageName: string): string => path.join(REPO_NAME, packageName);
