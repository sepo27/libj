import { makeUri } from '../src/makeUri';
import { MakeUriError } from '../src/MakeUriError';

describe('makeUri()', () => {
  it('with scheme base uri alone', () => {
    expect(makeUri('https:')).toBe('https:');
  });

  it('with scheme base uri with host-authority', () => {
    expect(makeUri('http:', {
      authority: 'host.me',
    })).toBe('http://host.me');
  });

  it('with scheme base uri with user-host-authority & path', () => {
    expect(makeUri('ftp:', {
      authority: 'sepo@my.host',
      path: '/foo',
    })).toBe('ftp://sepo@my.host/foo');
  });

  it('with scheme base uri with host-port-authority & path & query', () => {
    expect(makeUri('http:', {
      authority: 'my.host:333',
      path: '/foo',
      query: { bar: 'baz' },
    })).toBe('http://my.host:333/foo?bar=baz');
  });

  it('with scheme base uri with host-port-authority & path & fragment', () => {
    expect(makeUri('http:', {
      authority: 'my.host:333',
      path: '/foo',
      fragment: { bar: 'baz' },
    })).toBe('http://my.host:333/foo#bar=baz');
  });

  it('with scheme base uri with user-host-port-authority & path & query & fragment', () => {
    expect(makeUri('https:', {
      authority: 'sepo@host.com:123',
      path: '/path',
      query: { foo: 'bar' },
      fragment: { fox: 'brown' },
    })).toBe('https://sepo@host.com:123/path?foo=bar#fox=brown');
  });

  it('with scheme base uri with host-authority & query', () => {
    expect(makeUri('http:', {
      authority: 'host.com',
      query: { foo: 'bar' },
    })).toBe('http://host.com?foo=bar');
  });

  it('with scheme base uri with host-authority & fragment', () => {
    expect(makeUri('http:', {
      authority: 'my.com',
      fragment: { baz: 'zab' },
    })).toBe('http://my.com#baz=zab');
  });

  it('with scheme base uri with host-authority & query & fragment', () => {
    expect(makeUri('http:', {
      authority: 'my.com',
      query: { bar: 'foo' },
      fragment: { baz: 'zab' },
    })).toBe('http://my.com?bar=foo#baz=zab');
  });

  it('errors out when scheme base uri with scheme', () => {
    expect(
      () => makeUri('http:', { scheme: 'ftp:', authority: 'stuff.com' }),
    ).toThrow(new MakeUriError('Conflicting scheme given in base uri and params'));
  });

  it('errors out when scheme base uri without authority & with path', () => {
    expect(
      () => makeUri('http:', { path: '/foo/bar' }),
    ).toThrow(new MakeUriError('Missing authority in params for scheme base uri'));
  });
});
