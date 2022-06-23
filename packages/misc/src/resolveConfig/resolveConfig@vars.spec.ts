import * as sinonLib from 'sinon';
import * as fs from 'fs';
import { ModuleMock } from '../../../tbench/src';
import { resolveConfig } from './resolveConfig';

describe('resolveConfig()', () => {
  let sinon: sinonLib.SinonSandbox, mock: any;

  beforeEach(() => {
    sinon = sinonLib.createSandbox();

    const fileReader = sinon.stub().returns({});

    mock = {
      fs: ModuleMock(fs, sinon),
      fileReader,
      configData: data => fileReader.returns(data),
    };
    mock.fs.existsSync.returns(true);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('resolves vars with simple absolute reference', () => {
    mock.configData({
      foo: 'bar',
      baz: '{{ $foo }}',
    });

    assertConfig({
      foo: 'bar',
      baz: 'bar',
    });
  });

  it('resolves vars with simple absolute reference inside str', () => {
    mock.configData({
      foo: 'foo',
      baz: 'A {{ $foo }}',
    });

    assertConfig({
      foo: 'foo',
      baz: 'A foo',
    });
  });

  it('resolves vars with multiple absolute references within string', () => {
    mock.configData({
      abc: 'A B C',
      def: { ghi: 'The {{ $abc }} AND {{ $xyz }}' },
      xyz: 'XYZ',
    });

    assertConfig({
      abc: 'A B C',
      def: { ghi: 'The A B C AND XYZ' },
      xyz: 'XYZ',
    });
  });

  it('resolves vars with multiple absolute references within string #2', () => {
    mock.configData({
      abc: 'A B C',
      def: { ghi: 'The {{ $abc }} AND {{ $abc }}' },
      xyz: 'XYZ',
    });

    assertConfig({
      abc: 'A B C',
      def: { ghi: 'The A B C AND A B C' },
      xyz: 'XYZ',
    });
  });

  it('resolves vars with nested absolute reference', () => {
    mock.configData({
      foo: '{{$bar.baz}}',
      bar: { baz: 'zab' },
    });

    assertConfig({
      foo: 'zab',
      bar: { baz: 'zab' },
    });
  });

  it('resolves vars with nested & circular absolute references', () => {
    mock.configData({
      foo: '{{$bar.baz}}',
      bar: { baz: '{{$xyz}}' },
      xyz: 'abc',
    });

    assertConfig({
      foo: 'abc',
      bar: { baz: 'abc' },
      xyz: 'abc',
    });
  });

  it('resolves relative ref vars on same level', () => {
    mock.configData({
      foo: {
        bar: 'BAR',
        baz: '{{ .bar }}',
      },
    });

    assertConfig({
      foo: {
        bar: 'BAR',
        baz: 'BAR',
      },
    });
  });

  it('resolves relative ref vars on same level at root', () => {
    mock.configData({
      abc: '{{ .xyz }}',
      xyz: 'ZYX',
    });

    assertConfig({
      abc: 'ZYX',
      xyz: 'ZYX',
    });
  });

  it('resolves relative ref vars surrounded by strings', () => {
    mock.configData({
      zyx: 'A {{ .which }} grail',
      which: 'Holly',
    });

    assertConfig({
      zyx: 'A Holly grail',
      which: 'Holly',
    });
  });

  it('resolves relative ref vars from deeper level', () => {
    mock.configData({
      foo: 'abc',
      bar: { baz: '{{ ..foo }}' },
    });

    assertConfig({
      foo: 'abc',
      bar: { baz: 'abc' },
    });
  });

  it('resolves mixed relative ref vars from different levels', () => {
    mock.configData({
      foo: 'The {{ .bar.baz }}',
      bar: {
        baz: 'Bazzz: {{ .abc }}',
        abc: 'ABC',
      },
    });

    assertConfig({
      foo: 'The Bazzz: ABC',
      bar: {
        baz: 'Bazzz: ABC',
        abc: 'ABC',
      },
    });
  });

  it('resolves mixed relative ref vars from different levels mixed', () => {
    mock.configData({
      foo: 'The Foo',
      bar: { baz: 'And the Baz ({{ ..xyz.abc }})' },
      xyz: {
        abc: 'ABC: {{ .def }}',
        def: 'DEF IS: {{ ..foo }}',
      },
    });

    assertConfig({
      foo: 'The Foo',
      bar: { baz: 'And the Baz (ABC: DEF IS: The Foo)' },
      xyz: {
        abc: 'ABC: DEF IS: The Foo',
        def: 'DEF IS: The Foo',
      },
    });
  });

  it('resolves relative ref vars concatenated', () => {
    mock.configData({
      foo: '{{ .bar.baz }} + {{ .bar.abc }}',
      bar: {
        baz: 'The bazzzz',
        abc: 'And the {{ .baz }}',
      },
    });

    assertConfig({
      foo: 'The bazzzz + And the The bazzzz',
      bar: {
        baz: 'The bazzzz',
        abc: 'And the The bazzzz',
      },
    });
  });

  it('resolves mixed absolute / relative ref vars on different levels', () => {
    mock.configData({
      '@vars': {
        foo: 'Foo',
        bar: 'Bar',
      },
      abc: {
        xyz: 'And {{ .def }} XYZ',
        def: 'The DEF: {{ $@vars.foo }}',
      },
      another: '{{ $stuff }}',
      stuff: '{{ .abc.xyz }} + {{ .abc.def }}',
    });

    assertConfig({
      '@vars': {
        foo: 'Foo',
        bar: 'Bar',
      },
      abc: {
        xyz: 'And The DEF: Foo XYZ',
        def: 'The DEF: Foo',
      },
      another: 'And The DEF: Foo XYZ + The DEF: Foo',
      stuff: 'And The DEF: Foo XYZ + The DEF: Foo',
    });
  });

  // TODO: #65: https://github.com/sepo27/libj/issues/65
  xit('errors out for circular dependency with absolute vars', () => {
    mock.configData({
      foo: '{{ $foo }}',
    });

    expect(
      () => resolveConfig('/dummy', mock.fileReader, { resolveVars: true }),
    ).toThrow(new Error('Circular config var reference detected: $foo -> $foo'));
  });

  // TODO: #65: https://github.com/sepo27/libj/issues/65
  xit('errors out for circular dependency with absolute vars #2', () => {
    mock.configData({
      foo: '{{ $bar }}',
      bar: '{{ $foo }}',
    });

    expect(
      () => resolveConfig('/dummy', mock.fileReader, { resolveVars: true }),
    ).toThrow(new Error('Circular config var reference detected: $foo -> $bar -> $foo'));
  });

  it('resolves var refs in recursive arrays', () => {
    mock.configData({
      foo: '{{ $bar.0.baz }}',
      bar: [{ baz: 'The Bazz' }],
    });

    assertConfig({
      foo: 'The Bazz',
      bar: [{ baz: 'The Bazz' }],
    });
  });

  it('does not resolve vars if not configured', () => {
    mock.configData({
      foo: '{{ .bar }}',
    });

    expect(resolveConfig('/dummy', mock.fileReader)).toEqual({
      foo: '{{ .bar }}',
    });
  });

  it('errors out when var value not found', () => {
    mock.configData({
      abc: '{{ $dummy }}',
    });

    expect(
      () => resolveConfig('/dummy', mock.fileReader, { resolveVars: true }),
    ).toThrow(new Error('Variable value not found by path: $dummy'));
  });

  it('supports vars with @extends', () => {
    const
      configFile = '/local.json',
      configMap = {
        [configFile]: {
          '@extends': './common.json',
          abc: '{{ $xyz }}',
          xyz: 'THE XYZ',
        },
        '/common.json': {
          foo: '{{ .bar }}',
          bar: 'Baz',
        },
      },
      fileReader = mockFileReader(configMap);

    expect(resolveConfig(configFile, fileReader, { resolveVars: true })).toEqual({
      abc: 'THE XYZ',
      xyz: 'THE XYZ',
      foo: 'Baz',
      bar: 'Baz',
    });
  });

  /*** Private ***/

  function assertConfig(expectedConfig) {
    expect(resolveConfig('/foo.yml', mock.fileReader, { resolveVars: true })).toEqual(expectedConfig);
  }

  const mockFileReader = map => {
    const fileReader = sinon.stub();

    Object.keys(map).forEach(configFile => {
      fileReader.withArgs(configFile).returns(map[configFile]);
    });

    return fileReader;
  };
});
