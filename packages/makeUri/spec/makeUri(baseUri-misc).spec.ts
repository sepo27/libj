import { makeUri } from '../src/makeUri';
import { MakeUriError } from '../src/MakeUriError';

describe('makeUri()', () => {
  it('with scheme-authority-path base uri & path', () => {
    expect(makeUri('http://some.host/foo', { path: '/bar' }))
      .toBe('http://some.host/foo/bar');
  });

  it('with query base uri & fragment', () => {
    expect(makeUri('?foo=bar', { fragment: { baz: 'zoo' } }))
      .toBe('?foo=bar#baz=zoo');
  });

  it('errors out for query base uri with query', () => {
    expect(
      () => makeUri('?foo=bar', { query: { foxy: 'lady' } }),
    ).toThrow(new MakeUriError('Query base uri with scheme or authority or path or query in params not supported.'));
  });

  it('errors out for query base uri with path', () => {
    expect(
      () => makeUri('?foo=bar', { path: '/foo' }),
    ).toThrow(new MakeUriError('Query base uri with scheme or authority or path or query in params not supported.'));
  });

  it('errors out for query base uri with authority', () => {
    expect(
      () => makeUri('?foo=bar', { authority: 'foo.bar' }),
    ).toThrow(new MakeUriError('Query base uri with scheme or authority or path or query in params not supported.'));
  });

  it('errors out for query base uri with scheme', () => {
    expect(
      () => makeUri('?foo=bar', { scheme: 'http:' }),
    ).toThrow(new MakeUriError('Query base uri with scheme or authority or path or query in params not supported.'));
  });

  it('errors out for fragment base uri', () => {
    expect(
      () => makeUri('#foo=bar'),
    ).toThrow(new MakeUriError('Fragment base uri is not supported'));
  });
});
