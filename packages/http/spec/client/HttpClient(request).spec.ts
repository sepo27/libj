import { HttpClientTBench } from '../bench/HttpClientTBench';
import { httpResponseGen } from '../bench/httpResponseGen';
import { HttpClient } from '../../src/client/HttpClient';
import { HttpMethod } from '../../src/meta/HttpMethod';
import { HttpStatus } from '../../src/meta/status';
import { HttpResponseError } from '../../src/error/HttpResponseError';
import { HttpForm } from '../../src/form/HttpForm';
import { HttpConfigError } from '../../src/error/HttpConfigError';

describe('HttpClient(request)', () => {
  let bench: HttpClientTBench;

  beforeEach(() => {
    bench = new HttpClientTBench();
    bench.mock.axios.instance.request.resolves(httpResponseGen());
  });

  afterEach(() => {
    bench.restore();
  });

  it('constructs with config', () => {
    const config = {
      baseURL: 'https://some-domain.com/api/',
    };

    client(config);

    bench.assert.axios.main.create.calledOnce(config);
  });

  it('request() with url', () => {
    const url = 'https://foo.bar';

    client().request(url);

    bench.assert.axios.instance.request.calledOnce({ url });
  });

  it('request() with options', () => {
    const options = {
      method: HttpMethod.POST,
    };

    client().request('https://dummy.com', options);

    bench.assert.axios.instance.request.calledOnce(options);
  });

  it('request() does not overwrite url in options', () => {
    const
      url = 'https://foo.com',
      options = { url: 'https://bar.com' };

    client().request(url, options);

    bench.assert.axios.instance.request.calledOnce({ url });
  });

  it('request() resolves with response', () => {
    const res = httpResponseGen({
      data: { foo: 'bar' },
    });

    bench.mock.axios.instance.request.resolves(res);

    const http = new HttpClient();

    expect(http.request('')).resolves.toMatchObject({
      data: res.data,
    });
  });

  it('request() throws custom http error on response error', () => {
    const response = httpResponseGen({
      status: HttpStatus.BAD_REQUEST,
    });

    const err = new Error();
    // @ts-ignore
    err.response = response;

    bench.mock.axios.instance.request.rejects(err);

    const http = new HttpClient();

    return expect(http.request(''))
      .rejects
      .toMatchObject(new HttpResponseError(HttpStatus.BAD_REQUEST, { data: response.data, headers: response.headers }));
  });

  it('request() re-throws other errors', () => {
    const err = new Error('Test error');

    bench.mock.axios.instance.request.rejects(err);

    const http = new HttpClient();

    return expect(http.request(''))
      .rejects
      .toMatchObject(err);
  });

  it('request() with form', () => {
    const
      formHeaders = { foo: 'bar' },
      form = new HttpForm();

    bench.mock.sinon.stub(form, 'getHeaders').returns(formHeaders);
    const mock = bench.mock.axios.instance.request;

    client().request('', {
      method: HttpMethod.POST,
      data: form,
    });

    expect(mock.calledOnce).toBeTruthy();
    expect(mock.getCall(0).args).toMatchObject([{
      data: form,
      headers: formHeaders,
    }]);
  });

  it('request() with form overwrites headers from options', () => {
    const
      formHeaders = { bar: 'bazzz' },
      headers = {
        foxy: 'Lady',
      },
      form = new HttpForm();

    bench.mock.sinon.stub(form, 'getHeaders').returns(formHeaders);
    const mock = bench.mock.axios.instance.request;

    client().request('', {
      method: HttpMethod.POST,
      data: form,
      headers: {
        foxy: 'Lady',
      },
    });

    expect(mock.calledOnce).toBeTruthy();
    expect(mock.getCall(0).args).toMatchObject([{
      headers: {
        ...headers,
        ...formHeaders,
      },
    }]);
  });

  it('request() errors out when trying form with methods other than POST / PUT / PATCH', () => {
    expect(
      () => new HttpClient().request('', {
        method: HttpMethod.GET,
        data: new HttpForm(),
      }),
    ).toThrow(new HttpConfigError('Form data is only allowed with POST / PUT / PATCH methods'));
  });
});

/*** Lib ***/

function client(config = {}) {
  return new HttpClient(config);
}
