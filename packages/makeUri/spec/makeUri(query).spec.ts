import { makeUri } from '../src/makeUri';

const
  scheme = 'http',
  host = 'my.happy.world',
  path = '/find/us';

describe('makeUri()', () => {
  it('with query', () => {
    expect(makeUri({ query: { foo: 'bar' } })).toEqual('foo=bar');
  });

  it('with encoded query values', () => {
    expect(makeUri({
      query: {
        $data: {
          foxy: 'la dy',
        },
        $options: {
          encode: true,
        },
      },
    })).toEqual('foxy=la%20dy');
  });

  it('with query & path', () => {
    expect(makeUri({
      path: '/foo/bar',
      query: { fox: 'baz' },
    })).toBe('/foo/bar?fox=baz');
  });

  it('with options query & path', () => {
    expect(makeUri({
      path: '/foo/bar',
      query: { $data: undefined, $options: { encode: false } },
    })).toBe('/foo/bar');
  });

  it('with query, path & authority', () => {
    expect(makeUri({
      authority: host,
      path,
      query: {
        $data: {
          foo: '{bar}',
          baz: 'f x',
        },
        $options: {
          encode: { include: ['baz'] },
        },
      },
    })).toBe('my.happy.world/find/us?foo={bar}&baz=f%20x');
  });

  it('with query, path, authority & scheme', () => {
    expect(makeUri({
      scheme,
      authority: host,
      path: 'bazzz',
      query: {
        foo: true,
      },
    })).toBe('http://my.happy.world/bazzz?foo');
  });

  it('with query & authority', () => {
    expect(makeUri({
      authority: host,
      query: {
        foo: 'fox',
      },
    })).toBe('my.happy.world?foo=fox');
  });
});
