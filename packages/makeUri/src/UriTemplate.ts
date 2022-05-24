import { UriPart } from './UriPart';

const Tag = {
  SCHEME: 'scheme',
  AUTHORITY: 'authority',
  HOST: 'host',
  USER: 'user',
  PORT: 'port',
  PATH: 'path',
  QUERY: 'query',
  FRAGMENT: 'fragment',
};

const Tpl = {
  URI: tpl(Tag.SCHEME, Tag.AUTHORITY, Tag.PATH, Tag.QUERY, Tag.FRAGMENT),
  SCHEME: tpl(Tag.SCHEME, UriPart.COLON),
  AUTHORITY: tpl(Tag.USER, Tag.HOST, Tag.PORT),
  PORT: tpl(UriPart.COLON, Tag.PORT),
  USER: tpl(Tag.USER, UriPart.AT),
  PATH: tpl(UriPart.SLASH, Tag.PATH),
  FRAGMENT: tpl(UriPart.HASH, Tag.FRAGMENT),
};

export const UriTemplate = {
  uri(parts: UriParts): string {
    return produce(Tpl.URI, parts);
  },

  scheme(val: string): string {
    return produce(Tpl.SCHEME, { scheme: val }, {
      sanitize: [`${UriPart.COLON}${UriPart.DSLASH}`, UriPart.COLON], // order matters !
    });
  },

  authority(parts: AuthorityParts, prefix: boolean = false): string {
    const template = prefixTpl([UriPart.DSLASH, prefix], Tpl.AUTHORITY);
    return produce(template, { port: '', user: '', ...parts });
  },

  port(val: number | string): string {
    return produce(Tpl.PORT, { port: val });
  },

  user(val: string): string {
    return produce(Tpl.USER, { user: val });
  },

  path(val: string, { trimTrail }: { trimTrail?: boolean } = { trimTrail: false }): string {
    return produce(Tpl.PATH, { path: val }, {
      sanitize: trimTrail ? /^\/+|\/+$/g : /^\/+/,
    });
  },

  query(val: string, prefix: boolean = false): string {
    const template = prefixTpl([UriPart.QM, prefix], Tag.QUERY);
    return produce(template, { query: val });
  },

  fragment(val: string): string {
    return produce(Tpl.FRAGMENT, { [Tag.FRAGMENT]: val });
  },
};

/*** Private ***/

interface UriParts {
  scheme: string,
  authority: string,
}

interface AuthorityParts {
  host: string,
  port?: string,
  user?: string,
}

interface ProduceOptions {
  sanitize?: string | string[] | RegExp | RegExp[],
}

function produce(template, parts, options: ProduceOptions = {}) {
  const pattern = `{(${Object.keys(parts).join('|')})}`;

  return template.replace(
    new RegExp(pattern, 'g'),
    (_, p1) => sanitize(parts[p1], options.sanitize),
  );
}

function sanitize(val, slag) {
  if (!slag) {
    return val;
  }

  const needle = Array.isArray(slag) ? slag : [slag];
  return needle.reduce(
    (acc, replace) => acc.replace(
      replace instanceof RegExp ? replace : new RegExp(replace, 'g'),
      '',
    ),
    val,
  );
}

function tpl(...parts) {
  return parts
    .map(p => (/^[a-z]+$/.test(p) ? `{${p}}` : p))
    .join('');
}

function prefixTpl(prefix, ...parts) {
  const
    [prefixStr, condition] = prefix,
    prefixPart = condition ? prefixStr : '';

  return tpl(prefixPart, ...parts);
}
