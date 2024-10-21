import { makeUri } from '../src/makeUri';
import { MakeUriError } from '../src/MakeUriError';

const path = '/find/us';

describe('makeUri()', () => {
  it('with path', () => {
    expect(makeUri({ path })).toBe('/find/us');
  });

  it('adds leading slash to path', () => {
    expect(makeUri({ path: 'find/us' })).toBe('/find/us');
  });

  it('handles root path', () => {
    expect(makeUri({ path: '/' })).toBe('/');
  });

  it('with template path & params', () => {
    expect(makeUri({
      path: {
        template: '/foo/:bar',
        params: { bar: 'baz' },
      },
    })).toBe('/foo/baz');
  });

  it('errors out with template & missing params', () => {
    // @ts-ignore
    expect(() => makeUri({ path: { template: '/foo/:baz' } }))
      .toThrow(new MakeUriError('Missing params: baz | for path template: /foo/:baz'));
  });

  it('errors out with template & incomplete params', () => {
    // @ts-ignore
    expect(() => makeUri({ path: { template: '/foo/:bar/:baz/:zak', params: { bar: 'bar' } } }))
      .toThrow(new MakeUriError('Missing params: baz,zak | for path template: /foo/:bar/:baz/:zak'));
  });

  it('with authority & path', () => {
    expect(makeUri({ authority: 'some.com', path: 'foo/bar' })).toBe('some.com/foo/bar');
  });

  it('with obj authority & path', () => {
    expect(makeUri({
      authority: {
        host: 'foo.bar',
        port: '333',
      },
      path: '/foxxxxxy/lady',
    })).toBe('foo.bar:333/foxxxxxy/lady');
  });

  it('with scheme, authority & path', () => {
    expect(makeUri({
      scheme: 'ftps',
      authority: 'sepo@sepo.one:3357',
      path: '/the/sun',
    })).toBe('ftps://sepo@sepo.one:3357/the/sun');
  });

  it('with multiple paths to join', () => {
    expect(makeUri({ path: ['foo', '/bar', '/baz'] })).toBe('/foo/bar/baz');
  });

  it('with path trimTrail option and string path', () => {
    expect(makeUri({
      path: {
        path: '/foo/',
        opts: { trimTrail: true },
      },
    })).toBe('/foo');
  });

  it('with path trimTrail option and string path #2', () => {
    expect(makeUri({
      path: {
        path: '/foo///',
        opts: { trimTrail: true },
      },
    })).toBe('/foo');
  });

  it('with path trimTrial option & multiple paths', () => {
    expect(makeUri({
      path: {
        path: ['/foo', '/bar/', '/baz///'],
        opts: { trimTrail: true },
      },
    })).toBe('/foo/bar/baz');
  });

  it('with path trimTrial option & template', () => {
    expect(makeUri({
      path: {
        path: {
          template: '/foo/:bar/baz///',
          params: { bar: 'abc' },
        },
        opts: { trimTrail: true },
      },
    })).toBe('/foo/abc/baz');
  });

  it('with single slash path in between', () => {
    expect(makeUri({
      path: ['/foo', '/', '/bar'],
    })).toBe('/foo/bar');
  });

  it('with empty strings in path parts', () => {
    expect(makeUri({
      path: ['/foo', '', 'bar', '', '/baz/', ''],
    })).toBe('/foo/bar/baz');
  });
});
