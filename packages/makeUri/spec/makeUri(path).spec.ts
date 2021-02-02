import { makeUri } from '../src/makeUri';

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
});
