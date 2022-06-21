import { LooseObject } from '../../../../common/types';
import { isObj, isStr } from '../../../../common/isType/isType';

const
  AbsoluteVarRefTokenRegex = makeVarTokenRegex('\\$([\\w.@]+)'),
  RelativeVarRefTokenRegex = makeVarTokenRegex('(\\.+)([\\w.@]+)');

interface Context {
  rootData: LooseObject
  parentPath: string[]
}

export const resolveConfigVars = (data: any, inContext: Context = null): any => {
  const context = inContext || { rootData: data, parentPath: [] };

  return Object.keys(data).reduce((acc, key) => {
    const val = data[key];

    if (isObj(val)) {
      return Object.assign(acc, {
        [key]: resolveConfigVars(val, {
          rootData: context.rootData,
          parentPath: context.parentPath.concat(key),
        }),
      });
    }

    if (!isStr(val)) {
      return Object.assign(acc, { [key]: val });
    }

    return Object.assign(acc, { [key]: resolveStrVal(val, context) });
  }, {});
};

/*** Private ***/

function resolveStrVal(val: string, context: Context) {
  const varRef = defineVarRef(val);

  if (varRef && varRef.isAbsolute) {
    const
      refVal = getValByPath(context.rootData, varRef.path),
      nextVal = val.replace(varRef.token, refVal);

    return resolveStrVal(nextVal, context);
  }

  if (varRef) {
    const
      refPath = resolveRelativePath(context.parentPath, varRef.levelUp, varRef.path),
      refVal = getValByPath(context.rootData, refPath),
      nextRefContext = {
        rootData: context.rootData,
        parentPath: refPath.slice(0, -1),
      },
      nextRefVal = resolveStrVal(refVal, nextRefContext),
      nextVal = val.replace(varRef.token, nextRefVal);

    return resolveStrVal(nextVal, context);
  }

  return val;
}

function defineVarRef(val) {
  let match;

  match = AbsoluteVarRefTokenRegex.exec(val);
  if (match) {
    return {
      isAbsolute: true,
      token: match[0],
      path: match[1].split('.'),
    };
  }

  match = RelativeVarRefTokenRegex.exec(val);
  if (match) {
    return {
      isAbsolute: false,
      token: match[0],
      levelUp: match[1].split('').length - 1,
      path: match[2].split('.'),
    };
  }

  return null;
}

function getValByPath(data, valPath: string[]) {
  let ret = data;

  for (let i = 0; i < valPath.length; i++) {
    const p = valPath[i];

    if (ret[p] === undefined) {
      throw new Error(`Variable value not found by path: $${toStrPath(valPath)}`);
    }
    ret = ret[p];
  }

  return ret;
}

function resolveRelativePath(partnerPath, levelUp, valPath) {
  return partnerPath.slice(0, levelUp ? -levelUp : 1).concat(valPath);
}

function makeVarTokenRegex(pattern, flags = '') {
  return new RegExp(`{{\\s*${pattern}\\s*}}`, flags);
}

function toStrPath(varPath: string[]): string { return varPath.join('.'); }
