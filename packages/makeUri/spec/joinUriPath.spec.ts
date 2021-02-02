import { joinUriPath } from '../src/joinUriPath';

describe('joinUriPath()', () => {
  it('raw parts', () => {
    expect(joinUriPath('foo', 'bar')).toBe('/foo/bar');
  });

  it('path & raw part', () => {
    expect(joinUriPath('/foo', 'bar')).toBe('/foo/bar');
  });

  it('path & path', () => {
    expect(joinUriPath('/foo', '/bar')).toBe('/foo/bar');
  });

  it('path & path #2', () => {
    expect(joinUriPath('/foo/', '/bar')).toBe('/foo/bar');
  });

  it('path & path #3', () => {
    expect(joinUriPath('/foo', '/bar/')).toBe('/foo/bar');
  });

  it('path & path #4', () => {
    expect(joinUriPath('/foo/', '/bar/')).toBe('/foo/bar');
  });

  it('uri with host uri & raw part', () => {
    expect(joinUriPath('host.com/', 'foo')).toBe('host.com/foo');
  });

  it('uri with host uri & path', () => {
    expect(joinUriPath('host.com/', '/bar')).toBe('host.com/bar');
  });

  it('uri with host uri & path #2', () => {
    expect(joinUriPath('host.com/foo', '/bar')).toBe('host.com/foo/bar');
  });

  it('uri with host uri & path #3', () => {
    expect(joinUriPath('host.com/foo/', '/bar/')).toBe('host.com/foo/bar');
  });
});
