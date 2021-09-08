import { AxiosRequestConfig } from 'axios';
import { HttpClientTBench } from '../bench/HttpClientTBench';
import { httpResponseGen } from '../bench/httpResponseGen';
import { HttpClient } from '../../src';
import { LoggerInterface } from '../../../../common/LoggerInterface';
import { HttpStatus, httpStatusText } from '../../../httpMeta/src';

describe('HttpClient', () => {
  let bench: HttpClientTBench;

  beforeEach(() => {
    bench = new HttpClientTBench();
    bench.mock.axios.instance.request.resolves(httpResponseGen());
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

  it('logs error response', () => {
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
});

/*** Lib ***/

class DummyLogger implements LoggerInterface {
  debug() {}
  error() {}
  info() {}
  log() {}
  warn() {}
}
