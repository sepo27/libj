import { makeUri } from '../src/makeUri';
import { MakeUriError } from '../src/MakeUriError';

describe('makeUri()', () => {
  it('with path base uri alone', () => {
    expect(makeUri('/foo')).toBe('/foo');
  });

  it('with path base uri & query', () => {
    expect(makeUri('/foo', { query: { bar: 'baz' } }))
      .toBe('/foo?bar=baz');
  });

  it('with path base uri & fragment', () => {
    expect(makeUri('/foo', { fragment: { bar: 'baz' } }))
      .toBe('/foo#bar=baz');
  });

  it('with path base uri & query & fragment', () => {
    expect(makeUri('/path', { query: { foo: 'bar' }, fragment: { bar: 'baz' } }))
      .toBe('/path?foo=bar#bar=baz');
  });

  it('with path base uri & path', () => {
    expect(makeUri('/foo', { path: '/bar' }))
      .toBe('/foo/bar');
  });

  it('with path base uri & path #2', () => {
    expect(makeUri('/foo/', { path: '/bar' }))
      .toBe('/foo/bar');
  });

  it('with path base uri & path template', () => {
    expect(makeUri('/foo', { path: { template: '/bar/:fox', params: { fox: 'lady' } } }))
      .toBe('/foo/bar/lady');
  });

  it('errors out when path base uri with authority', () => {
    expect(
      () => makeUri('/path', { authority: 'host.com' }),
    ).toThrow(new MakeUriError('Path base uri and authority or scheme in params not supported.'));
  });

  it('errors out when path base uri with scheme', () => {
    expect(
      () => makeUri('/path', { scheme: 'https:' }),
    ).toThrow(new MakeUriError('Path base uri and authority or scheme in params not supported.'));
  });
});
