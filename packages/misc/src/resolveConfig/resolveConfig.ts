import * as path from 'path';
import * as fs from 'fs';
import * as deepMerge from 'deepmerge';
import { FormattedError } from '../FormattedError';
import { LooseObject } from '../../../../common/types';
import { resolveConfigVars } from './resolveConfigVars';

const EXTENDS_KEYWORD = '@extends';

type FileReader = (file: string) => LooseObject;

interface Options {
  resolveVars?: boolean
  hideServiceKeys?: boolean
}

export const resolveConfig = (configFile: string, fileReader: FileReader, opts: Options = {}): LooseObject => {
  if (!fs.existsSync(configFile)) {
    throw new FormattedError('Unable to resolve config file: %s', configFile);
  }

  let config = fileReader(configFile);

  if (opts.resolveVars) {
    config = resolveConfigVars(config);
  }

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

    if (Object.keys(extendConfig) && opts.resolveVars) {
      extendConfig = resolveConfigVars(extendConfig);
    }

    config = deepMerge(extendConfig, config);
    delete config[EXTENDS_KEYWORD];
  }

  if (opts.hideServiceKeys) {
    config = Object.keys(config).reduce(
      (acc, key) => (
        key.indexOf('@') === 0 ? acc : Object.assign(acc, { [key]: config[key] })
      ),
      {},
    );
  }

  return config;
};
