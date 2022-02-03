import { ConfigBag } from './ConfigBag';

describe('ConfigBag', () => {
  it('gets required top level setting', () => {
    const config = new ConfigBag({
      foo: 'The Foo',
    });

    expect(config.get('foo')).toBe('The Foo');
  });

  it('gets required nested setting', () => {
    const config = new ConfigBag({
      foo: { bar: { baz: 'What a Bazzzz' } },
    });

    expect(config.get('foo.bar.baz')).toBe('What a Bazzzz');
  });

  it('errors out for missing required top level setting', () => {
    const config = new ConfigBag({});
    expect(() => config.get('foo')).toThrow(new Error('Missing config setting by path: foo'));
  });

  it('errors out for missing required top level setting #2', () => {
    const config = new ConfigBag({
      baz: 'baz',
    });
    expect(() => config.get('foo')).toThrow(new Error('Missing config setting by path: foo'));
  });

  it('errors out for empty string required top level setting', () => {
    const config = new ConfigBag({
      baz: '',
    });
    expect(() => config.get('baz')).toThrow(new Error('Missing config setting by path: baz'));
  });

  it('errors out for missing required nested setting', () => {
    const config = new ConfigBag({});
    expect(() => config.get('foo.baz.bar')).toThrow(new Error('Missing config setting by path: foo.baz.bar'));
  });

  it('errors out for missing required nested setting #2', () => {
    const config = new ConfigBag({ foo: { bar: { baz: 'foo-bar-baz' } } });
    expect(() => config.get('foo.bar.dummy')).toThrow(new Error('Missing config setting by path: foo.bar.dummy'));
  });

  it('dumps data', () => {
    const
      data = { bar: 'And The Foo' },
      config = new ConfigBag(data);

    expect(config.dump()).toBe(data);
  });

  it('instantiates sub-config bag', () => {
    const
      data = {
        foo: 'bar',
        baz: {
          foxy: 'Thing',
        },
      },
      config = new ConfigBag(data),
      subConfig = config.get('baz') as ConfigBag;

    expect(subConfig).toBeInstanceOf(ConfigBag);
    expect(subConfig.dump()).toEqual(data.baz);
  });

  it('gets optional top level setting default value', () => {
    const config = new ConfigBag({});

    expect(config.getOptional('foo')).toBeNull();
  });

  it('gets optional nested setting default value', () => {
    const config = new ConfigBag({});

    expect(config.getOptional('foo.bar.baz')).toBeNull();
  });

  it('gets optional setting with custom default value', () => {
    const config = new ConfigBag({});
    expect(config.getOptional('foo.bar', false)).toBeFalsy();
  });

  it('gets optional top level setting', () => {
    const config = new ConfigBag({
      foo: 'At the Bar',
    });

    expect(config.getOptional('foo')).toBe('At the Bar');
  });

  it('gets optional nested setting', () => {
    const config = new ConfigBag({
      foo: { bazy: { bar: 'FooBazyBar' } },
    });

    expect(config.getOptional('foo.bazy.bar')).toBe('FooBazyBar');
  });

  it('instantiates sub-config bag for optional setting', () => {
    const
      data = {
        foo: 'bar',
        baz: {
          foxy: 'Thing',
        },
      },
      config = new ConfigBag(data),
      subConfig = config.getOptional('baz') as ConfigBag;

    expect(subConfig).toBeInstanceOf(ConfigBag);
    expect(subConfig.dump()).toEqual(data.baz);
  });

  it('verifies existing values', () => {
    const config = new ConfigBag({
      foo: {
        bar: 'baz',
      },
    });

    expect(config.has('foo')).toBeTruthy();
    expect(config.has('foo.bar')).toBeTruthy();
  });

  it('denies missing values', () => {
    const config = new ConfigBag({
      foo: {
        bazzzzzz: 'baz',
      },
    });

    expect(config.has('foo')).toBeTruthy();
    expect(config.has('foo.bar')).toBeFalsy();
  });
});
