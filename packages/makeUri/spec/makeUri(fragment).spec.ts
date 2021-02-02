import { makeUri } from '../src/makeUri';

const
  scheme = 'http',
  host = 'my.happy.world',
  path = '/find/us',
  query = {
    time: '333',
    locale: 'ru',
  };

describe('makeUri()', () => {
  it('with fragment & path', () => {
    expect(makeUri({
      path: '/path',
      fragment: { foo: 'bar' },
    })).toBe('/path#foo=bar');
  });

  it('with encoded fragment & path', () => {
    expect(makeUri({
      path: 'the/path',
      fragment: {
        $data: { foo: 'the foo' },
        $options: { encode: true },
      },
    })).toBe('/the/path#foo=the%20foo');
  });

  it('with fragment, query & path', () => {
    expect(makeUri({
      path: '/a/path',
      query: { foo: 'bar' },
      fragment: { baz: 'abc' },
    })).toBe('/a/path?foo=bar#baz=abc');
  });

  it('with fragment, query, path & authority', () => {
    expect(makeUri({
      authority: host,
      path,
      query,
      fragment: { foo: true },
    })).toBe('my.happy.world/find/us?time=333&locale=ru#foo');
  });

  it('with fragment, query, path, authority & scheme', () => {
    expect(makeUri({
      scheme,
      authority: host,
      path,
      query,
      fragment: {
        $data: {
          foo: 'the}{foo',
          bar: '{bar}',
          baz: ' baz ',
        },
        $options: { encode: { exclude: ['foo'] } },
      },
    })).toBe('http://my.happy.world/find/us?time=333&locale=ru#foo=the}{foo&bar=%7Bbar%7D&baz=%20baz%20');
  });

  it('with fragment, path & authority', () => {
    expect(makeUri({
      authority: host,
      path,
      fragment: {
        foo: 'bar',
      },
    })).toBe('my.happy.world/find/us#foo=bar');
  });

  it('with fragment & authority', () => {
    expect(makeUri({
      authority: host,
      fragment: {
        foo: 'bar',
      },
    })).toBe('my.happy.world#foo=bar');
  });
});
