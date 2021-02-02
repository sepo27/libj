import { makeUri } from '../src/makeUri';
import { MakeUriError } from '../src/MakeUriError';

describe('makeUri()', () => {
  it('with host-authority base uri alone', () => {
    expect(makeUri('host.com')).toBe('host.com');
  });

  it('with user-host-authority base uri & path', () => {
    expect(makeUri('sepo@host.com', { path: '/path' }))
      .toBe('sepo@host.com/path');
  });

  it('with host-port-authority base uri & path & query', () => {
    expect(makeUri('host.com:333', { path: '/foo', query: { bar: 'baz' } }))
      .toBe('host.com:333/foo?bar=baz');
  });

  it('with host-port-authority base uri & path & fragment', () => {
    expect(makeUri('host.com:333', { path: '/foo', fragment: { bar: 'baz' } }))
      .toBe('host.com:333/foo#bar=baz');
  });

  it('with user-host-port-authority base uri & path & query & fragment', () => {
    expect(makeUri('sepo@host.com:333', { path: '/foo', query: { bar: 'baz' }, fragment: { foxy: 'lady' } }))
      .toBe('sepo@host.com:333/foo?bar=baz#foxy=lady');
  });

  it('with host-authority base uri & query', () => {
    expect(makeUri('host.com', { query: { foo: 'bar' } }))
      .toBe('host.com?foo=bar');
  });

  it('with host-port-authority base uri & fragment', () => {
    expect(makeUri('host.com:123', { fragment: { foo: 'bar' } }))
      .toBe('host.com:123#foo=bar');
  });

  it('with host-port-authority base uri & query & fragment', () => {
    expect(makeUri('host.com:123', { query: { abc: 'bca' }, fragment: { foo: 'bar' } }))
      .toBe('host.com:123?abc=bca#foo=bar');
  });

  it('errors out with host-authority base uri & authority', () => {
    expect(
      () => makeUri('host.com', { authority: 'dummy.com' }),
    ).toThrow(new MakeUriError('Conflicting authority given in base uri and params'));
  });

  it('errors out with host-authority base uri & scheme', () => {
    expect(
      () => makeUri('host.com', { scheme: 'https:' }),
    ).toThrow(new MakeUriError('Authority base uri and scheme in params not supported.'));
  });
});
