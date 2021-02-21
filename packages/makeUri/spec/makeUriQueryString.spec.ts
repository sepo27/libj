import { makeUriQueryString } from '../src/makeUriQueryString';

describe('makeUriQueryString()', () => {
  it('for some values', () => {
    expect(makeUriQueryString({ foo: 'bar' })).toBe('foo=bar');
  });

  it('for bool true', () => {
    expect(makeUriQueryString({ baz: true })).toBe('baz');
  });

  it('for str true', () => {
    expect(makeUriQueryString({ fox: 'true' })).toBe('fox=true');
  });

  it('encodes all values', () => {
    expect(makeUriQueryString({
      foo: '(a)',
      bar: '{b}',
    }, { encode: true })).toBe(
      `foo=${encodeURIComponent('(a)')}&bar=${encodeURIComponent('{b}')}`,
    );
  });

  it('handles already encoded values', () => {
    expect(makeUriQueryString({ bar: '%7Bb%7D' }, { encode: true })).toBe('bar=%7Bb%7D');
  });

  it('encodes with include', () => {
    expect(makeUriQueryString(
      {
        foo: '{a',
        bar: ' b',
      },
      { encode: { include: ['bar'] } },
    )).toBe('foo={a&bar=%20b');
  });

  it('encodes with exclude', () => {
    expect(makeUriQueryString(
      {
        foo: '{a',
        bar: ' b',
        baz: 'b}',
      },
      { encode: { exclude: ['foo'] } },
    )).toBe('foo={a&bar=%20b&baz=b%7D');
  });

  it('defaults to encode everything', () => {
    expect(makeUriQueryString({ foo: 'a foo' }))
      .toBe('foo=a%20foo');
  });
});
