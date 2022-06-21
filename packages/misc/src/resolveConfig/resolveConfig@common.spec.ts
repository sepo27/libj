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

  it('supports skipping "service keys" with @ sign on top level', () => {
    mock.configData({
      '@vars': {
        foo: 'bar',
      },
      baz: 'ABC',
    });

    assertConfig({ baz: 'ABC' }, {
      hideServiceKeys: true,
    });
  });

  /*** Lib ***/

  function assertConfig(expectedConfig, opts = {}) {
    expect(resolveConfig('/foo.yml', mock.fileReader, { resolveVars: true, ...opts })).toEqual(expectedConfig);
  }
});
