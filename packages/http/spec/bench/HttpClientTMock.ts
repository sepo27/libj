import * as sinonLib from 'sinon';
import * as fs from 'fs-extra';
import axios from 'axios';
import { ClassMock, ModuleMock } from '../../../tbench/src';
import { HttpClientConfig } from '../../src/client/types';
import { HttpClient } from '../../src/client/HttpClient';
import { LooseObject } from '../../../../common/types';
import { FormData } from '../../src/form/FormData';
import * as HttpFormModule from '../../src/form/HttpForm';

interface HttpResult {
  http: HttpClient,
  mock: LooseObject,
}

export class HttpClientTMock {
  constructor() {
    this.sinon = sinonLib.createSandbox();

    const
      axiosInstance = {
        interceptors: {
          request: { use: () => {} },
          response: { use: () => {} },
        },
        request() {},
      },
      axiosInstanceMock = ModuleMock(axiosInstance, this.sinon);

    this.axios = {
      main: ModuleMock(axios, this.sinon),
      instance: axiosInstanceMock,
    };
    this.axios.main.create.returns(axiosInstance);

    // TODO: why mocking by string does not work ?
    this.fs = ModuleMock(fs, this.sinon);

    this.http = {
      instance: (config: HttpClientConfig = {}): HttpResult => {
        const
          http = new HttpClient(config),
          mock = ModuleMock(http);

        return { http, mock };
      },
    };

    this.formData = ModuleMock(FormData.prototype, this.sinon);

    this.form = ClassMock(HttpFormModule, {
      'getHeaders()': null,
      'append()': null,
      'appendFile()': null,
    }, this.sinon);
  }

  /*** Public ***/

  public readonly sinon: sinonLib.SinonSandbox;
  public readonly axios;
  public readonly fs;
  public readonly form;
  public readonly http;
  public readonly formData;

  public restore() {
    this.sinon.restore();
  }
}
