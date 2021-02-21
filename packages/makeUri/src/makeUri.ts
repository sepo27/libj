import { UriTemplate } from './UriTemplate';
import { isArr, isObj, isStr } from '../../../common/isType/isType';
import { LooseObject } from '../../../common/types';
import { makeUriQueryString, UriQueryStringOptions } from './makeUriQueryString';
import { MakeUriBaseUri as BaseUri } from './MakeUriBaseUri';
import { MakeUriError } from './MakeUriError';
import { rtrimUriPath } from './trimUriPath';
import { joinUriPath } from './joinUriPath';

interface Params {
  scheme?: string,
  authority?: AuthorityOpt, // eslint-disable-line no-use-before-define
  path?: PathOpt, // eslint-disable-line no-use-before-define
  query?: QueryOpt, // eslint-disable-line no-use-before-define
  fragment?: QueryOpt, // eslint-disable-line no-use-before-define
}

type Args = [Params] | [string] | [string, Params];

export const makeUri = (...args: Args): string => {
  const
    params = extractParams(args),
    parts = defineParts(params),
    baseUri = params.baseUri,
    builtUri = UriTemplate.uri(parts);

  return `${baseUri}${builtUri}`;
};

/*** Private ***/

interface InternalParams extends Params {
  baseUri: BaseUri,
}

interface AuthorityParams {
  host: string,
  port?: number | string,
  user?: string,
}

type AuthorityOpt = string | AuthorityParams;

interface PathParams {
  template: string,
  params: LooseObject,
}

type PathOpt = string | PathParams | string[];

interface QueryParams {
  $data: LooseObject,
  $options: UriQueryStringOptions,
}

type QueryOpt = LooseObject | QueryParams;

function extractParams(args): InternalParams {
  let baseUri, params;

  if (args.length === 1 && isObj(args[0])) {
    ([baseUri, params] = ['', args[0]]);
  } else if (args.length === 1 && isStr(args[0])) {
    ([baseUri, params] = [args[0], {}]);
  } else if (args.length === 2) {
    ([baseUri, params] = args);
  } else {
    throw new MakeUriError(`Invalid makeUri() args given: ${JSON.stringify(args)}`);
  }

  return { ...params, baseUri: prepareBaseUri(baseUri, params) };
}

function prepareBaseUri(baseUri, params) {
  const
    uri = new BaseUri(rtrimUriPath(baseUri)),
    hasParams = Object.keys(params).length > 0,
    { authority, scheme, path, query } = params;

  // Validate scheme

  if (uri.schemeOnly && hasParams && !authority) {
    throw new MakeUriError('Missing authority in params for scheme base uri');
  } else if (uri.hasScheme && hasParams && scheme) {
    throw new MakeUriError('Conflicting scheme given in base uri and params');
  }

  // Validate authority

  if (uri.hasAuthority && hasParams && authority) {
    throw new MakeUriError('Conflicting authority given in base uri and params');
  } else if (uri.hasAuthority && hasParams && scheme) {
    throw new MakeUriError('Authority base uri and scheme in params not supported.');
  }

  // Validate path

  if (uri.hasPath && hasParams && (authority || scheme)) {
    throw new MakeUriError('Path base uri and authority or scheme in params not supported.');
  }

  // Validate query

  if (uri.hasQuery && hasParams && (query || path || authority || scheme)) {
    throw new MakeUriError('Query base uri with scheme or authority or path or query in params not supported.');
  }

  // Validate fragment
  if (uri.hasFragment) {
    throw new MakeUriError('Fragment base uri is not supported');
  }

  return uri;
}

function defineParts(params: InternalParams) {
  const
    { scheme, authority, path, query, fragment, baseUri } = params,
    parts = {
      scheme: '',
      authority: '',
      path: '',
      query: '',
      fragment: '',
    };

  if (scheme) {
    parts.scheme = makeScheme(scheme, params);
  }

  if (authority) {
    parts.authority = makeAuthority(authority, params);
  }

  if (path) {
    parts.path = makePath(path);
  }

  if (query) {
    parts.query = makeQuery(query, params);
  }

  if (fragment && (authority || path || baseUri.hasAuthority || baseUri.hasPath || baseUri.hasQuery)) {
    parts.fragment = makeFragment(fragment);
  }

  return parts;
}

function makeScheme(scheme, { authority }: InternalParams) {
  if (!authority) {
    throw new MakeUriError('Missing authority for scheme.');
  }
  return UriTemplate.scheme(scheme);
}

function makeAuthority(authority, { scheme, baseUri }: InternalParams) {
  const parts = {
    host: '',
    port: '',
    user: '',
  };

  if (isStr(authority)) {
    parts.host = authority as string;
  } else if (isObj(authority)) {
    const { host, port, user } = (authority as AuthorityParams);
    parts.host = host;
    if (port) {
      parts.port = UriTemplate.port(port);
    }
    if (user) {
      parts.user = UriTemplate.user(user);
    }
  }

  const hasPrefix = !!scheme || (baseUri.schemeOnly);

  return UriTemplate.authority(parts, hasPrefix);
}

function makePath(path) {
  let rawPath = '';

  if (isStr(path)) {
    rawPath = path as string;
  } else if (isObj(path)) {
    const { template, params } = path as PathParams;
    rawPath = template.replace(
      new RegExp(`:(${Object.keys(params).join('|')})`, 'g'),
      (_, p) => params[p],
    );
  } else if (isArr(path)) {
    rawPath = joinUriPath(...path);
  }

  return UriTemplate.path(rawPath);
}

function makeQuery(query, { authority, path, baseUri }: InternalParams) {
  const
    [data, options] = extractQueryOpt(query),
    usePrefix = !!(authority || path) || baseUri.hasAuthority || baseUri.hasPath;

  return UriTemplate.query(makeUriQueryString(data, options), usePrefix);
}

function makeFragment(fragment) {
  const [data, options] = extractQueryOpt(fragment);
  return UriTemplate.fragment(makeUriQueryString(data, options));
}

function extractQueryOpt(opt: QueryOpt) {
  const [data, options] = opt.$data ? [opt.$data, opt.$options] : [opt, {}];
  return [data, options];
}
