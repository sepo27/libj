import { LooseObject } from '../../../common/types';
import { isObj } from '../../../common/isType/isType';

interface Options {
  encode?: EncodeOpt, // eslint-disable-line no-use-before-define
}
export { Options as UriQueryStringOptions };

const DefaultOptions: Options = {
  encode: true,
};

export const makeUriQueryString = (query: LooseObject, options: Options = {}): string => {
  const opts = { ...DefaultOptions, ...options };

  return Object
    .keys(query)
    .map(k => {
      let val = query[k];

      if (val === true) {
        return k;
      }

      if (needEncode(opts, k)) {
        val = encode(val);
      }

      return `${k}=${val}`;
    })
    .join('&');
};

/*** Private ***/

interface EncodeInclude {
  include: string[],
}

interface EncodeExclude {
  exclude: string[],
}

type EncodeOpt = boolean | EncodeInclude | EncodeExclude;

function needEncode(options, k): boolean {
  if (options.encode) {
    if (options.encode === true) {
      return true;
    }

    if (
      isObj(options.encode)
      && (options.encode as EncodeInclude).include
      && (options.encode as EncodeInclude).include.indexOf(k) > -1
    ) {
      return true;
    }

    if (
      isObj(options.encode)
      && (options.encode as EncodeExclude).exclude
      && (options.encode as EncodeExclude).exclude.indexOf(k) < 0
    ) {
      return true;
    }
  }

  return false;
}

function encode(val) {
  return encodeURIComponent(decodeURIComponent(val));
}
