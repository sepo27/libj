import { LooseObject, MapS } from '../../../../../common/types';
import { CliPath } from '../../../CliPath';

interface Params {
  files?: MapS<string>,
  packageJson?: LooseObject,
  dependencies?: MapS<{
    packageJson?: string,
  }>,
  hasCommon?: boolean,
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
      hasCommon = false,
    } = params,
      fileMap = {};

  mockDistPlantedPathsExist();
  
  mock.execFileSync;
  
  const fileKeys = Object.keys(files);
  
  if (fileKeys.length) {
    fileKeys.forEach(srcFile => {
      const srcFilename = packageDistPlantedSrcPath(srcFile);

      mock.glob.sync
        .withArgs(packageDistPlantedSrcPath('**/*.js'))
        .returns([srcFilename]);

      mock.fs.readFileSync.withArgs(srcFilename).returns(files[srcFile]);

      fileMap[srcFile] = srcFilename;
    });
  } else {
    mock.glob.sync
      .withArgs(packageDistPlantedSrcPath('**/*.js'))
      .returns([]);
  }

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

  mockDistIgnoreGlobPaths();

  mock.fs.copySync;
  mock.fs.removeSync;
  
  return { fileMap };

  /*** Private ***/

  function mockDistPlantedPathsExist() {
    mock.fs.existsSync
      .withArgs(CliPath.packageDist(packageName, CliPath.Part.COMMON))
      .returns(hasCommon);
    
    if (hasCommon) {
      mock.fs.existsSync.withArgs(CliPath.packageDist(packageName, packageName)).returns(false);
      mock.fs.existsSync.withArgs(CliPath.packageDistPackages(packageName)).returns(true);
    } else {
      mock.fs.existsSync.withArgs(CliPath.packageDist(packageName, packageName)).returns(true);
      mock.fs.existsSync.withArgs(CliPath.packageDistPackages(packageName)).returns(false);
    }
  }

  function mockDistIgnoreGlobPaths() {
    let paths;

    if (hasCommon) {
      paths = [CliPath.packageDistPackages(packageName)];
    } else {
      paths = Object.keys(dependencies).reduce(
        (acc, dName) => acc.concat(CliPath.packageDist(dName)),
        [CliPath.packageDist(packageName)],
      );
    }

    mock.glob.sync
      .withArgs(CliPath.packageDistIgnore(packageName))
      .returns([paths]);
  }

  function packageDistPlantedPath(...parts) {
    return hasCommon
      ? CliPath.packageDistPackages(packageName, ...parts)
      : CliPath.packageDist(packageName, ...parts)
  }
  
  function packageDistPlantedSrcPath(...parts) {
    return packageDistPlantedPath(packageName, CliPath.Part.SRC, ...parts);
  }
};
