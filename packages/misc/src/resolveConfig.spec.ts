import * as sinonLib from 'sinon';
import * as fs from 'fs';
import { ModuleMock } from '../../tbench/src';
import { resolveConfig } from './resolveConfig';

describe('resolveConfig()', () => {
  let sinon: sinonLib.SinonSandbox, mock: any;

  beforeEach(() => {
    sinon = sinonLib.createSandbox();
    mock = {
      fs: ModuleMock(fs, sinon),
    };
    mock.fs.existsSync.returns(true);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('resolves simple config using file reader', () => {
    const
      filename = '/foo.json',
      fileReader = () => ({
        foo: 'bar',
      });

    expect(resolveConfig(filename, fileReader)).toEqual({
      foo: 'bar',
    });
  });

  it('resolves config extending by absolute file path', () => {
    const
      configFile = '/config/foo.json',
      configMap = {
        [configFile]: {
          '@extends': '/config/bar.json',
          foo: 'bar',
        },
        '/config/bar.json': {
          bar: 'foo',
        },
      },
      fileReader = mockFileReader(configMap);

    expect(resolveConfig(configFile, fileReader)).toEqual({
      bar: 'foo',
      foo: 'bar',
    });
  });

  it('resolves config extending by relative path', () => {
    const
      configFile = '/config/local.json',
      configMap = {
        [configFile]: {
          '@extends': './common.json',
          foo: 'bar',
        },
        '/config/common.json': {
          baz: 'foo',
        },
      },
      fileReader = mockFileReader(configMap);

    expect(resolveConfig(configFile, fileReader)).toEqual({
      baz: 'foo',
      foo: 'bar',
    });
  });

  it('resolves config extending by relative filename', () => {
    const
      configFile = '/config/local.json',
      configMap = {
        [configFile]: {
          '@extends': 'common.json',
          abc: 'xyz',
        },
        '/config/common.json': {
          baz: 'bar',
        },
      },
      fileReader = mockFileReader(configMap);

    expect(resolveConfig(configFile, fileReader)).toEqual({
      baz: 'bar',
      abc: 'xyz',
    });
  });

  it('resolves config extending multiple configs', () => {
    const
      configFile = '/config/foo.json',
      configMap = {
        [configFile]: {
          '@extends': ['/config/bar.json', './baz.json'],
          foo: 'bar',
        },
        '/config/bar.json': {
          bar: 'bar',
          foo: 'The Foo',
        },
        '/config/baz.json': {
          baz: 'bazzz',
          bar: 'The Barrr',
        },
      },
      fileReader = mockFileReader(configMap);

    expect(resolveConfig(configFile, fileReader)).toEqual({
      bar: 'The Barrr',
      baz: 'bazzz',
      foo: 'bar',
    });
  });

  it('resolves config with nested extends', () => {
    const
      configFile = '/config/foo.json',
      configMap = {
        [configFile]: {
          '@extends': ['base.json', './patch.json'],
          foo: 'bar',
          baz: {
            a: 'b',
          },
        },
        '/config/base.json': {
          abc: 'xyz',
        },
        '/config/baz.json': {
          baz: {
            a: 'aaa',
            b: 'b',
          },
        },
        '/config/patch.json': {
          '@extends': 'baz.json',
          foo: 'The Foo!',
          baz: {
            b: 'bbb',
          },
        },
      };

    expect(resolveConfig(configFile, mockFileReader(configMap))).toEqual({
      foo: 'bar',
      abc: 'xyz',
      baz: {
        a: 'b',
        b: 'bbb',
      },
    });
  });

  it('errors out for invalid config file', () => {
    const configFile = '/bar.json';
    mock.fs.existsSync.withArgs(configFile).returns(false);

    expect(() => resolveConfig(configFile, () => ({}))).toThrowError(new Error(
      `Unable to resolve config file: ${configFile}`,
    ));
  });

  it('errors out for invalid extend config file', () => {
    const
      configFile = '/bar.json',
      config = {
        '@extends': 'foo.json',
      };

    mock.fs.existsSync.withArgs(configFile).returns(true);
    mock.fs.existsSync.withArgs('/foo.json').returns(false);
    const fileReader = sinon.stub()
      .withArgs(configFile)
      .returns(config);

    expect(() => resolveConfig(configFile, fileReader)).toThrowError(new Error(
      'Unable to resolve config file: /foo.json',
    ));
  });

  /*** Lib ***/

  const mockFileReader = map => {
    const fileReader = sinon.stub();

    Object.keys(map).forEach(configFile => {
      fileReader.withArgs(configFile).returns(map[configFile]);
    });

    return fileReader;
  };
});
