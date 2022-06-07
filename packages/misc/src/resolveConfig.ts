import * as path from 'path';
import * as fs from 'fs';
import * as deepMerge from 'deepmerge';
import { FormattedError } from './FormattedError';
import { LooseObject } from '../../../common/types';

const EXTENDS_KEYWORD = '@extends';

type FileReader = (file: string) => LooseObject;

export const resolveConfig = (configFile: string, fileReader: FileReader): LooseObject => {
  if (!fs.existsSync(configFile)) {
    throw new FormattedError('Unable to resolve config file: %s', configFile);
  }

  let config = fileReader(configFile);

  if (config[EXTENDS_KEYWORD]) {
    let extendConfig = {};

    const extendConfigList = Array.isArray(config[EXTENDS_KEYWORD])
      ? config[EXTENDS_KEYWORD]
      : [config[EXTENDS_KEYWORD]];

    extendConfigList.forEach(file => {
      const extendConfigFile = path.isAbsolute(file)
        ? file
        : path.resolve(path.dirname(configFile), file);

      extendConfig = deepMerge(extendConfig, resolveConfig(extendConfigFile, fileReader));
    });

    config = deepMerge(extendConfig, config);
    delete config[EXTENDS_KEYWORD];
  }

  return config;
};
