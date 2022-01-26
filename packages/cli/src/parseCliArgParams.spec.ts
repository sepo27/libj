import { parseCliArgParams } from './parseCliArgParams';

describe('parseCliArgParams()', () => {
  let DefaultParams;

  beforeEach(() => {
    DefaultParams = { arg: 'foo', description: 'bar' };
  });

  afterEach(() => {
    DefaultParams = null;
  });

  it('returns all defaults', () => {
    expect(parseCliArgParams([], DefaultParams))
      .toEqual([DefaultParams.arg, DefaultParams.description, {}]);
  });

  it('returns arg with default description and opts ', () => {
    expect(parseCliArgParams(['argFoo'], DefaultParams))
      .toEqual(['argFoo', DefaultParams.description, {}]);
  });

  it('returns arg, description and default opts ', () => {
    expect(parseCliArgParams(['argFoo', 'desc'], DefaultParams))
      .toEqual(['argFoo', 'desc', {}]);
  });

  it('returns arg, opts and default description', () => {
    const opts = { foo: 'bar' };

    expect(parseCliArgParams(['argFoo', opts], DefaultParams))
      .toEqual(['argFoo', DefaultParams.description, opts]);
  });

  it('returns arg, description and opts', () => {
    const
      arg = 'theFoo',
      desc = 'theBar',
      opts = { bar: 'foo' };

    expect(parseCliArgParams([arg, desc, opts], DefaultParams))
      .toEqual([arg, desc, opts]);
  });

  it('resolves custom default opts', () => {
    const
      inputOpts = { foxy: 'lady' },
      defaultOpts = { baz: 'bar' },
      input = [
        {
          params: ['foo'],
          expected: ['foo', DefaultParams.description, defaultOpts],
        },
        {
          params: ['foo', 'bar'],
          expected: ['foo', 'bar', defaultOpts],
        },
        {
          params: ['foo', inputOpts],
          expected: ['foo', DefaultParams.description, inputOpts],
        },
        {
          params: ['foo', 'bar', inputOpts],
          expected: ['foo', 'bar', inputOpts],
        },
      ];

    input.forEach(({ params, expected }) => {
      expect(parseCliArgParams(params as any, { ...DefaultParams, opts: defaultOpts }))
        .toEqual(expected);
    });
  });

  it('errors out for invalid params', () => {
    const invalidParams = [
      ['a', 'b', 'c'],
      ['a', 'b', {}, 'c'],
    ];

    invalidParams.forEach(params => {
      expect(
        // @ts-ignore
        () => parseCliArgParams(params, DefaultParams),
      ).toThrowError(new Error('Invalid params'));
    });
  });
});
