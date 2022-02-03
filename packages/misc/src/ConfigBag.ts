import { LooseObject } from '../../../common/types';
import { isStr, isObj } from '../../../common/isType/isType';

const PATH_SEP = '.';

export class ConfigBag {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(private data: LooseObject) {}

  /*** Public ***/

  public get<V extends SettingValue = SettingValue>(path: string): V {
    const val = this.findValue(path);

    if (val === undefined || (isStr(val) && !val.trim())) {
      throw new Error(`Missing config setting by path: ${path}`);
    }

    return this.makeRetVal(val);
  }

  public getOptional<V extends SettingValue = SettingValue>(path: string, defaultValue: V | null = null): V | null {
    const val = this.findValue(path);

    if (val === undefined) {
      return defaultValue;
    }

    return this.makeRetVal(val);
  }

  public has(path: string): boolean {
    return !!this.findValue(path);
  }

  public dump(): LooseObject {
    return this.data;
  }

  /*** Private ***/

  private findValue(path) {
    const
      keys = path.split(PATH_SEP),
      val = keys.reduce(
        (acc, k) => (acc === undefined || acc[k] === undefined ? undefined : acc[k]),
        this.data,
      );

    return val;
  }

  private makeRetVal(val) {
    if (isObj(val)) {
      return new ConfigBag(val);
    }

    return val as any;
  }
}

/*** Lib ***/

type SettingValue = string | number | boolean | (string | number)[] | ConfigBag;
