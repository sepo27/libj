import { MakeUriBaseUri as BaseUri } from '../src/MakeUriBaseUri';

describe('MakeUriBaseUri', () => {
  it('toString()', () => {
    expect(new BaseUri('https://some.stuff').toString()).toBe('https://some.stuff');
  });

  it('detects scheme without authority', () => {
    const baseUri = new BaseUri('http:');
    expect(baseUri.hasScheme).toBeTruthy();
  });

  it('detects scheme with authority', () => {
    const baseUri = new BaseUri('https://stuff.com');
    expect(baseUri.hasScheme).toBeTruthy();
  });

  it('detects no authority in scheme', () => {
    const baseUri = new BaseUri('https:');
    expect(baseUri.hasNoAuthority).toBeTruthy();
  });

  it('detects scheme only', () => {
    const baseUri = new BaseUri('https:');
    expect(baseUri.schemeOnly).toBeTruthy();
  });

  it('detects host-authority alone', () => {
    const baseUri = new BaseUri('i.me');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects user-host-authority alone', () => {
    const baseUri = new BaseUri('sepo@host.me');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects port-host-authority alone', () => {
    const baseUri = new BaseUri('host.me:333');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects host-port-authority alone', () => {
    const baseUri = new BaseUri('sepo@host.me:333');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects host-authority with scheme', () => {
    const baseUri = new BaseUri('ftp://host.org');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects user-host-authority with scheme', () => {
    const baseUri = new BaseUri('ftp://sepo@host.org');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects host-port-authority with scheme', () => {
    const baseUri = new BaseUri('ftp://host.org:333');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects user-host-port-authority with scheme', () => {
    const baseUri = new BaseUri('ftp://sepo@host.org:333');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects host-authority with scheme & path', () => {
    const baseUri = new BaseUri('ftp://host.org/path');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects user-host-authority with scheme & path & query', () => {
    const baseUri = new BaseUri('ftp://sepo@host.org/path?foo=bar');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects user-host-authority with scheme & path & fragment', () => {
    const baseUri = new BaseUri('ftp://sepo@host.org/path#baz=abc');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects user-port-host-authority with scheme & path & query & fragment', () => {
    const baseUri = new BaseUri('ftp://sepo@host.org:321/path?foo=bar#foxy=lady');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects host-authority with path', () => {
    const baseUri = new BaseUri('my.host/the/path');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects user-host-authority with path & query', () => {
    const baseUri = new BaseUri('me@my.host/foo?bar');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects user-port-host-authority with path & fragment', () => {
    const baseUri = new BaseUri('me@my.host:333/foo#bar=baz');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects port-host-authority with path & query & fragment', () => {
    const baseUri = new BaseUri('my.host:333/path?foo=abc#bar=baz');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects host-authority with query', () => {
    const baseUri = new BaseUri('my.host?foo=bar');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects port-host-authority with query & fragment', () => {
    const baseUri = new BaseUri('my.host:333?foo=bar#baz');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects user-port-authority with fragment', () => {
    const baseUri = new BaseUri('sepo@my.host:333?#baz');
    expect(baseUri.hasAuthority).toBeTruthy();
  });

  it('detects path alone', () => {
    const baseUri = new BaseUri('/path');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects path with scheme & host-authority', () => {
    const baseUri = new BaseUri('https://some.com/path');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects path with scheme & port-host-authority & query', () => {
    const baseUri = new BaseUri('https://some.com:333/path?foo=bar');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects path with scheme & user-authority & fragment', () => {
    const baseUri = new BaseUri('https://sepo@some.com/path#foo=bar');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects path with scheme & user-port-authority & query & fragment', () => {
    const baseUri = new BaseUri('https://sepo@some.com/path?foo=bar#baz=fox');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects path with query', () => {
    const baseUri = new BaseUri('/path?foo=bar');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects path with fragment', () => {
    const baseUri = new BaseUri('/path#foo=bar');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects path with query & fragment', () => {
    const baseUri = new BaseUri('/path?foo=bar#baz=fox');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects empty-path alone', () => {
    const baseUri = new BaseUri('/');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects empty-path with scheme & host-authority', () => {
    const baseUri = new BaseUri('http://some.foo/');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects empty-path with scheme & port-host-authority & query', () => {
    const baseUri = new BaseUri('http://some.foo:333/?foo=bar');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects empty-path with scheme & user-authority & fragment', () => {
    const baseUri = new BaseUri('http://sepo@some.foo/#foo=bar');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects empty-path with scheme & user-port-authority & query & fragment', () => {
    const baseUri = new BaseUri('http://sepo@some.foo:335/?foxy=lady#foo=bar');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects empty-path with query', () => {
    const baseUri = new BaseUri('/?foo=bar');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects empty-path with fragment', () => {
    const baseUri = new BaseUri('/#foo=bar');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects empty-path with query & fragment', () => {
    const baseUri = new BaseUri('/?foo=bar#baz=fox');
    expect(baseUri.hasPath).toBeTruthy();
  });

  it('detects query alone', () => {
    const baseUri = new BaseUri('/?foo=bar');
    expect(baseUri.hasQuery).toBeTruthy();
  });

  it('detects query with scheme & host-authority', () => {
    const baseUri = new BaseUri('https://some.stuff?foo=bar');
    expect(baseUri.hasQuery).toBeTruthy();
  });

  it('detects query with scheme & port-host-authority & path', () => {
    const baseUri = new BaseUri('https://some.stuff:123/path?foo=bar');
    expect(baseUri.hasQuery).toBeTruthy();
  });

  it('detects fragment alone', () => {
    const baseUri = new BaseUri('#foo=bar');
    expect(baseUri.hasFragment).toBeTruthy();
  });

  it('detects fragment with scheme & port-host-authority & path', () => {
    const baseUri = new BaseUri('https://some.com/path#foo=bar');
    expect(baseUri.hasFragment).toBeTruthy();
  });
});
