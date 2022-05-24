import { UriTemplate } from './UriTemplate';
import { isArr, isObj, isStr } from '../../../common/isType/isType';
import { LooseObject } from '../../../common/types';
import { makeUriQueryString, UriQueryStringOptions } from './makeUriQueryString';
import { MakeUriBaseUri as BaseUri } from './MakeUriBaseUri';
import { MakeUriError } from './MakeUriError';
import { rtrimUriPath } from './trimUriPath';
import { joinUriPath } from './joinUriPath';
import { UriPart } from './UriPart';

export interface MakeUriParams {
  scheme?: string,
  authority?: AuthorityOpt, // eslint-disable-line no-use-before-define
  path?: PathOpt, // eslint-disable-line no-use-before-define
  query?: QueryOpt, // eslint-disable-line no-use-before-define
  fragment?: QueryOpt, // eslint-disable-line no-use-before-define
}

type Args = [MakeUriParams] | [string] | [string, MakeUriParams];

export const makeUri = (...args: Args): string => {
  const
    params = extractParams(args),
    parts = defineParts(params),
    baseUri = params.baseUri,
    builtUri = UriTemplate.uri(parts);

  return `${baseUri}${builtUri}`;
};

/*** Lib ***/

interface InternalParams extends MakeUriParams {
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

type PathVariants = string | PathParams | string[];

interface PathOptOptions {
  trimTrial?: boolean,
}

interface PathOptWithOpts {
  path: PathVariants,
  opts: PathOptOptions,
}

type PathOpt = PathVariants | PathOptWithOpts;

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
  let resPath, opts: PathOptOptions = { trimTrial: false };

  if (isObj(path) && path.path && path.opts) {
    ({ path: resPath, opts } = path as PathOptWithOpts);
    resPath = makeActualPath(resPath);
  } else {
    resPath = makeActualPath(path);
  }

  return UriTemplate.path(resPath, { trimTrail: opts.trimTrial });
}

function makeActualPath(path) {
  let res = '';

  if (isStr(path)) {
    res = path as string;
  } else if (isObj(path)) {
    const { template, params = {} } = path as PathParams;
    res = template.replace(
      new RegExp(`${UriPart.COLON}(${Object.keys(params).join('|')})`, 'g'),
      (m, p) => params[p] || m,
    );

    // Check if all params substituted
    if (res.indexOf(UriPart.COLON) > -1) {
      const missingParams = res
        .match(new RegExp(`${UriPart.COLON}\\w+`, 'g'))
        .map(p => p.substr(1));

      throw new MakeUriError(`Missing params: ${missingParams.join(',')} | for path template: ${template}`);
    }
  } else if (isArr(path)) {
    res = joinUriPath(...path);
  }

  return res;
}

function makeQuery(query, { authority, path, baseUri }: InternalParams) {
  const
    [data, options] = extractQueryOpt(query),
    usePrefix = Object.keys(data).length && (
      !!(authority || path) || baseUri.hasAuthority || baseUri.hasPath
    );

  return UriTemplate.query(makeUriQueryString(data, options), usePrefix);
}

function makeFragment(fragment) {
  const [data, options] = extractQueryOpt(fragment);
  return UriTemplate.fragment(makeUriQueryString(data, options));
}

function extractQueryOpt(opt: QueryOpt) {
  const [data = {}, options] = Object.prototype.hasOwnProperty.call(opt, '$data')
    ? [opt.$data, opt.$options]
    : [opt, {}];

  return [data, options];
}
