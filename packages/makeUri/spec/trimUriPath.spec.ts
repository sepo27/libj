import { ltrimUriPath, rtrimUriPath, trimUriPath } from '../src/trimUriPath';

describe('trimUriPath()', () => {
  it('cuts off slashes on both sides', () => {
    expect(trimUriPath('/foo')).toBe('foo');
  });

  it('cuts off slashes on both sides #2', () => {
    expect(trimUriPath('/foo/')).toBe('foo');
  });

  it('cuts off slashes on both sides #3', () => {
    expect(trimUriPath('foo/')).toBe('foo');
  });
});

describe('ltrimUriPath()', () => {
  it('cuts off slash on left side', () => {
    expect(ltrimUriPath('/foo')).toBe('foo');
  });

  it('leaves slash on right side', () => {
    expect(ltrimUriPath('/foo/')).toBe('foo/');
  });
});

describe('rtrimUriPath()', () => {
  it('cuts off slash on right side', () => {
    expect(rtrimUriPath('foo/')).toBe('foo');
  });

  it('leaves slash on left side', () => {
    expect(rtrimUriPath('/foo/')).toBe('/foo');
  });
});
