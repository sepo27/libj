import { LooseObject, MapS } from '../../../../../common/types';
import { CliPath } from '../../../CliPath';

interface Params {
  files?: MapS<string>,
  packageJson?: LooseObject,
  dependencies?: MapS<{
    packageJson?: string,
  }>,
}

interface Return {
  fileMap: MapS<string>,
}

const DefaultPackageJson = {
  version: '0.0.0',
  dependencies: {},
};

export const mockBundlePackageCommandPackage = mock => (packageName: string, params: Params = {}): Return => {
  const
    {
      files = {},
      packageJson = DefaultPackageJson,
      dependencies = [],
    } = params,
      fileMap = {};

  mock.fs.existsSync
    .withArgs(CliPath.packageDist(packageName, packageName))
    .returns(true);
  
  mock.execFileSync;
  
  Object.keys(files).forEach(srcFile => {
    const srcFilename = CliPath.packageDistSrc(packageName, srcFile);
    
    mock.glob.sync
      .withArgs(CliPath.packageDistSrc(packageName, '**/*.js'))
      .returns([srcFilename]);

    mock.fs.readFileSync.withArgs(srcFilename).returns(files[srcFile]);
    
    fileMap[srcFile] = srcFilename;
  });

  mock.fs.writeFileSync;

  mock.fs.readJsonSync
    .withArgs(CliPath.packageJson(packageName))
    .returns(packageJson);

  Object.keys(dependencies).forEach(dPackageName => {
    const
      dSpec = dependencies[dPackageName],
      dPackageJson = dSpec.packageJson || DefaultPackageJson;

    mock.fs.readJsonSync
      .withArgs(CliPath.packageJson(dPackageName))
      .returns(dPackageJson);
  });

  mock.fs.writeJsonSync;

  Object.keys(dependencies).forEach(dPackageName => {
    mock.glob.sync
      .withArgs(CliPath.packageDistTmpIgnore(packageName))
      .returns([CliPath.packageDist(dPackageName)]);
  });
  
  mock.fs.copySync;
  mock.fs.removeSync;
  
  return { fileMap };
};
