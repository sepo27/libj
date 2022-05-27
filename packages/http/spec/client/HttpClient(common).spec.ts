import { AxiosRequestConfig } from 'axios';
import * as AxiosRetryModule from '../../src/lib/axiosRetry';
import { HttpClientTBench } from '../bench/HttpClientTBench';
import { httpResponseGen } from '../bench/httpResponseGen';
import { HttpClient } from '../../src';
import { LoggerInterface } from '../../../logger/src/LoggerInterface';
import { HttpStatus, httpStatusText, makeHttpBearerAuth } from '../../../httpMeta/src';
import * as HttpLoggerInterceptorModule from '../../src/interceptors/httpLoggerInterceptor';

describe('HttpClient', () => {
  let
    bench: HttpClientTBench,
    axiosRetryMock;

  beforeEach(() => {
    bench = new HttpClientTBench();
    bench.mock.axios.instance.request.resolves(httpResponseGen());
    axiosRetryMock = bench.mock.sinon.stub(AxiosRetryModule, 'axiosRetry');
  });

  afterEach(() => {
    bench.restore();
  });

  it('logs successful response', () => {
    const
      reqConfig = {
        url: 'https://foo.bar?baz',
        method: 'get',
      },
      response = httpResponseGen({
        status: HttpStatus.OK,
        statusText: httpStatusText(HttpStatus.OK),
        config: reqConfig as AxiosRequestConfig,
      });

    let resCbResult;

    bench.mock.axios.instance.interceptors.value({
      response: {
        use(successCb) {
          resCbResult = successCb(response);
        },
      },
    });

    const
      logger = new DummyLogger(),
      infoSpy = bench.mock.sinon.stub(logger, 'info');

    // eslint-disable-next-line no-new
    new HttpClient({ logger });

    // Assert logger info called

    expect(infoSpy.calledOnce).toBeTruthy();
    expect(infoSpy.getCall(0).args).toEqual([
      `[http] GET https://foo.bar?baz ${response.status} ${response.statusText}`,
    ]);

    // Assert request config is returned by callback

    expect(resCbResult).toBe(response);
  });

  it('logs successful response with base url', () => {
    const
      reqConfig = {
        baseURL: 'https://foo.bar',
        url: '/baz?zak=zak',
        method: 'post',
      },
      response = httpResponseGen({
        status: HttpStatus.OK,
        statusText: httpStatusText(HttpStatus.OK),
        config: reqConfig as AxiosRequestConfig,
      });

    bench.mock.axios.instance.interceptors.value({
      response: {
        use(successCb) {
          successCb(response);
        },
      },
    });

    const
      logger = new DummyLogger(),
      infoSpy = bench.mock.sinon.stub(logger, 'info');

    // eslint-disable-next-line no-new
    new HttpClient({ logger });

    // Assert logger info called

    expect(infoSpy.calledOnce).toBeTruthy();
    expect(infoSpy.getCall(0).args).toEqual([
      `[http] POST https://foo.bar/baz?zak=zak ${response.status} ${response.statusText}`,
    ]);
  });

  it('logs http error response', () => {
    const
      reqConfig = {
        url: 'https://bar.baz?fox',
        method: 'get',
      },
      error = {
        config: reqConfig,
        response: httpResponseGen({
          status: HttpStatus.BAD_REQUEST,
          statusText: httpStatusText(HttpStatus.BAD_REQUEST),
        }),
      };

    let thrownErr;

    bench.mock.axios.instance.interceptors.value({
      response: {
        use(_, failureCb) {
          try {
            failureCb(error);
          } catch (e) {
            thrownErr = e;
          }
        },
      },
    });

    const
      logger = new DummyLogger(),
      errorSpy = bench.mock.sinon.stub(logger, 'error');

    // eslint-disable-next-line no-new
    new HttpClient({ logger });

    // Assert logger error called

    expect(errorSpy.calledOnce).toBeTruthy();
    expect(errorSpy.getCall(0).args).toEqual([
      `[http] GET https://bar.baz?fox ${error.response.status} ${error.response.statusText}`,
    ]);

    // Assert error is thrown

    expect(thrownErr).toBe(error);
  });

  it('logs error response with base url', () => {
    const
      reqConfig = {
        baseURL: 'https://bar.bazzzzz',
        url: '/foo#stuff',
        method: 'get',
      },
      error = {
        config: reqConfig,
        response: httpResponseGen({
          status: HttpStatus.BAD_REQUEST,
          statusText: httpStatusText(HttpStatus.BAD_REQUEST),
        }),
      };

    bench.mock.axios.instance.interceptors.value({
      response: {
        use(_, failureCb) {
          try {
            failureCb(error);
          } catch (e) {
            // Silent
          }
        },
      },
    });

    const
      logger = new DummyLogger(),
      errorSpy = bench.mock.sinon.stub(logger, 'error');

    // eslint-disable-next-line no-new
    new HttpClient({ logger });

    // Assert logger error called

    expect(errorSpy.calledOnce).toBeTruthy();
    expect(errorSpy.getCall(0).args).toEqual([
      `[http] GET https://bar.bazzzzz/foo#stuff ${error.response.status} ${error.response.statusText}`,
    ]);
  });

  it('logs http error response with request data', () => {
    const
      reqConfig = {
        url: 'https://bar.baz?fox',
        method: 'post',
        data: { foo: 'bar' },
      },
      error = {
        config: reqConfig,
        response: httpResponseGen({
          status: HttpStatus.BAD_REQUEST,
          statusText: httpStatusText(HttpStatus.BAD_REQUEST),
        }),
      };

    // let thrownErr;

    bench.mock.axios.instance.interceptors.value({
      response: {
        use(_, failureCb) {
          try {
            failureCb(error);
          } catch (e) {
            // Silent
          }
        },
      },
    });

    const
      logger = new DummyLogger(),
      errorSpy = bench.mock.sinon.stub(logger, 'error');

    // eslint-disable-next-line no-new
    new HttpClient({
      logger: {
        logger,
        options: { requestDataLog: true },
      },
    });

    // Assert logger error called

    expect(errorSpy.calledOnce).toBeTruthy();

    expect(errorSpy.getCall(0).args).toEqual([
      // eslint-disable-next-line max-len
      `[http] POST https://bar.baz?fox ${JSON.stringify(reqConfig.data)} ${error.response.status} ${error.response.statusText}`,
    ]);
  });

  it('logs http error response with request data custom mapper', () => {
    const
      reqConfig = {
        url: 'https://bar.baz?fox',
        method: 'post',
        data: { foo: 'bar', baz: 'fox' },
      },
      error = {
        config: reqConfig,
        response: httpResponseGen({
          status: HttpStatus.BAD_REQUEST,
          statusText: httpStatusText(HttpStatus.BAD_REQUEST),
        }),
      };

    // let thrownErr;

    bench.mock.axios.instance.interceptors.value({
      response: {
        use(_, failureCb) {
          try {
            failureCb(error);
          } catch (e) {
            // Silent
          }
        },
      },
    });

    const
      logger = new DummyLogger(),
      errorSpy = bench.mock.sinon.stub(logger, 'error');

    // eslint-disable-next-line no-new
    new HttpClient({
      logger: {
        logger,
        options: {
          requestDataLog: data => Object
            .keys(data)
            .filter(k => k !== 'baz')
            .reduce(
              (acc, k) => Object.assign(acc, { [k]: data[k] }),
              {},
            ),
        },
      },
    });

    // Assert logger error called

    expect(errorSpy.calledOnce).toBeTruthy();

    expect(errorSpy.getCall(0).args).toEqual([
      // eslint-disable-next-line max-len
      `[http] POST https://bar.baz?fox ${JSON.stringify({ foo: 'bar' })} ${error.response.status} ${error.response.statusText}`,
    ]);
  });

  it('logs other error', () => {
    const
      reqConfig = {
        url: 'https://dummy.error/foo',
        method: 'post',
      },
      error = {
        config: reqConfig,
        response: undefined,
        toString() { return 'Error: Dummy error'; },
      };

    bench.mock.axios.instance.interceptors.value({
      response: {
        use(_, failureCb) {
          try {
            failureCb(error);
          } catch (e) {
            // Silence
          }
        },
      },
    });

    const
      logger = new DummyLogger(),
      errorSpy = bench.mock.sinon.stub(logger, 'error');

    // eslint-disable-next-line no-new
    new HttpClient({ logger });

    // Assert logger error called

    expect(errorSpy.calledOnce).toBeTruthy();
    expect(errorSpy.getCall(0).args).toEqual([
      `[http] POST https://dummy.error/foo ${error.toString()}`,
    ]);
  });

  it('logs other error with request data', () => {
    const
      reqConfig = {
        url: 'https://dummy.error/foo',
        method: 'post',
        data: { bazzzz: 'barrrrr' },
      },
      error = {
        config: reqConfig,
        response: undefined,
        toString() { return 'Error: Dummy error'; },
      };

    bench.mock.axios.instance.interceptors.value({
      response: {
        use(_, failureCb) {
          try {
            failureCb(error);
          } catch (e) {
            // Silence
          }
        },
      },
    });

    const
      logger = new DummyLogger(),
      errorSpy = bench.mock.sinon.stub(logger, 'error');

    // eslint-disable-next-line no-new
    new HttpClient({ logger: { logger, options: { requestDataLog: true } } });

    // Assert logger error called

    expect(errorSpy.calledOnce).toBeTruthy();
    expect(errorSpy.getCall(0).args).toEqual([
      `[http] POST https://dummy.error/foo ${JSON.stringify(reqConfig.data)} ${error.toString()}`,
    ]);
  });

  it('supports cookies option', () => {
    const axiosRequestMock = bench.mock.axios.instance.request;

    new HttpClient().request('', {
      cookies: {
        foo: 'bar',
        baz: 'abc',
      },
    });

    expect(axiosRequestMock.calledOnce);
    expect(axiosRequestMock.getCall(0).args).toMatchObject([{
      headers: {
        Cookie: [
          'foo=bar',
          'baz=abc',
        ],
      },
    }]);
  });

  it('appends cookies via option to existing header cookies', () => {
    const axiosRequestMock = bench.mock.axios.instance.request;

    new HttpClient().request('', {
      headers: {
        Cookie: ['foo=bar'],
      },
      cookies: {
        xyz: 'baz',
      },
    });

    expect(axiosRequestMock.calledOnce);
    expect(axiosRequestMock.getCall(0).args).toMatchObject([{
      headers: {
        Cookie: [
          'foo=bar',
          'xyz=baz',
        ],
      },
    }]);
  });

  it('appends cookies via option to existing header single cookie', () => {
    const axiosRequestMock = bench.mock.axios.instance.request;

    new HttpClient().request('', {
      headers: {
        Cookie: 'abc=zyx',
      },
      cookies: {
        foo: 'baz',
      },
    });

    expect(axiosRequestMock.calledOnce);
    expect(axiosRequestMock.getCall(0).args).toMatchObject([{
      headers: {
        Cookie: [
          'abc=zyx',
          'foo=baz',
        ],
      },
    }]);
  });

  it('sets cookies from option minding other headers & cookies', () => {
    const axiosRequestMock = bench.mock.axios.instance.request;

    new HttpClient().request('', {
      headers: {
        Foo: 'Bar',
        Cookie: 'baz=foo',
      },
      cookies: {
        MyCookie: 'val',
      },
    });

    expect(axiosRequestMock.calledOnce);
    expect(axiosRequestMock.getCall(0).args).toMatchObject([{
      headers: {
        Foo: 'Bar',
        Cookie: [
          'baz=foo',
          'MyCookie=val',
        ],
      },
    }]);
  });

  it('supports cookies option in constructor', () => {
    const axiosCreateMock = bench.mock.axios.main.create;

    // eslint-disable-next-line no-new
    new HttpClient({
      cookies: {
        foo: 'bar',
        baz: 'zab',
      },
    });

    expect(axiosCreateMock.calledOnce).toBeTruthy();
    expect(axiosCreateMock.getCall(0).args).toMatchObject([{
      headers: {
        Cookie: [
          'foo=bar',
          'baz=zab',
        ],
      },
    }]);
  });

  it('supports retry logic over constructor', () => {
    const retryConfig = {
      retries: 3,
      retryDelay: () => 300,
    };

    const client = new HttpClient({ retry: retryConfig });

    expect(axiosRetryMock.calledOnce).toBeTruthy();
    // @ts-ignore
    expect(axiosRetryMock.getCall(0).args).toEqual([client.agent, retryConfig]);
  });

  it('skips retry logic over constructor if not configured', () => {
    // eslint-disable-next-line no-new
    new HttpClient();

    expect(axiosRetryMock.callCount).toBe(0);
  });

  it('properly supports logger with retry logic', () => {
    const httpLoggerInterceptorMock = bench.mock.sinon.stub(HttpLoggerInterceptorModule, 'httpLoggerInterceptor');

    // eslint-disable-next-line no-new
    new HttpClient({ retry: { retries: 1 }, logger: new DummyLogger() });

    bench.mock.sinon.assert.callOrder(httpLoggerInterceptorMock, axiosRetryMock);
  });

  it('overwrites retry config on request level', () => {
    const axiosRequestMock = bench.mock.axios.instance.request;

    const retryConfig = { retries: 1 };

    new HttpClient().request('/dummy', { retry: retryConfig });

    expect(axiosRequestMock.calledOnce).toBeTruthy();
    expect(axiosRequestMock.getCall(0).args).toEqual([{
      url: '/dummy',
      'axios-retry': retryConfig,
    }]);
  });

  it('supports setting retry config after client instantiated', () => {
    const axiosRequestMock = bench.mock.axios.instance.request;

    const retryConfig = { retries: 5 };

    const client = new HttpClient();
    client.setRetry(retryConfig);
    client.request('/dummy');

    expect(axiosRequestMock.calledOnce).toBeTruthy();
    expect(axiosRequestMock.getCall(0).args).toMatchObject([{
      'axios-retry': retryConfig,
    }]);
  });

  it('merges retry configs when setting multiple times', () => {
    const axiosRequestMock = bench.mock.axios.instance.request;

    const
      retryConfigOne = { retries: 3, retryDelay: () => 1000 },
      retryConfigTwo = { retryDelay: () => 500 };

    const client = new HttpClient();
    client.setRetry(retryConfigOne);
    client.setRetry(retryConfigTwo);

    client.request('/dummy');

    expect(axiosRequestMock.calledOnce).toBeTruthy();
    expect(axiosRequestMock.getCall(0).args).toMatchObject([{
      'axios-retry': {
        ...retryConfigOne,
        ...retryConfigTwo,
      },
    }]);
  });

  it('merges request retry config with global one', () => {
    const axiosRequestMock = bench.mock.axios.instance.request;

    const
      globalRetryConfig = { retries: 3, retryDelay: () => 500 },
      requestRetryConfig = { retries: 5 };

    const client = new HttpClient();
    client.setRetry(globalRetryConfig);
    client.request('/dummy', { retry: requestRetryConfig });

    expect(axiosRequestMock.calledOnce).toBeTruthy();
    expect(axiosRequestMock.getCall(0).args).toMatchObject([{
      'axios-retry': {
        ...globalRetryConfig,
        ...requestRetryConfig,
      },
    }]);
  });

  it('supports auth with bearer token in constructor', () => {
    const token = 'sdlfksjdlfj';

    // eslint-disable-next-line no-new
    new HttpClient({ auth: { bearerToken: token } });

    const axiosCreateMock = bench.mock.axios.main.create;

    expect(axiosCreateMock.calledOnce).toBeTruthy();

    const actualConfig = axiosCreateMock.getCall(0).args[0];

    expect(actualConfig).toMatchObject({
      headers: {
        Authorization: makeHttpBearerAuth(token),
      },
    });
    expect(actualConfig).not.toMatchObject({ auth: { bearerToken: token } });
  });

  it('supports auth with bearer token in constructor preserving other headers', () => {
    const
      token = 'sdlfksjdlfj',
      config = {
        auth: { bearerToken: token },
        headers: {
          Authorization: 'foo: bar',
          Foo: 'Bar',
        },
      };

    // eslint-disable-next-line no-new
    new HttpClient(config);

    const axiosCreateMock = bench.mock.axios.main.create;

    expect(axiosCreateMock.calledOnce).toBeTruthy();

    const actualConfig = axiosCreateMock.getCall(0).args[0];

    expect(actualConfig).toMatchObject({
      headers: {
        Foo: 'Bar',
        Authorization: makeHttpBearerAuth(token),
      },
    });
    expect(actualConfig).not.toMatchObject({ auth: { bearerToken: token } });
  });

  it('supports auth with bearer in request', () => {
    const
      token = ';lkja;lskdfj;lskadf',
      options = {
        headers: {
          Authorization: 'bar: foo',
          Bar: 'Foo',
        },
        auth: { bearerToken: token },
      };

    const axiosRequestMock = bench.mock.axios.instance.request;

    new HttpClient().request('/dummy', options);

    expect(axiosRequestMock.calledOnce).toBeTruthy();

    const actualOptions = axiosRequestMock.getCall(0).args[0];

    expect(actualOptions).toMatchObject({
      headers: {
        Bar: 'Foo',
        Authorization: makeHttpBearerAuth(token),
      },
    });
    expect(actualOptions).not.toMatchObject({ auth: { bearerToken: token } });
  });
});

/*** Lib ***/

class DummyLogger implements LoggerInterface {
  debug() {}
  error() {}
  info() {}
  log() {}
  warn() {}
}
