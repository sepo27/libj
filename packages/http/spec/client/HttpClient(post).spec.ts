import { HttpClientTBench } from '../bench/HttpClientTBench';
import { httpResponseGen } from '../bench/httpResponseGen';
import { HttpStatus, HttpMethod } from '../../../httpMeta/src';
import { UrlEncodedHttpForm } from '../../src/form/UrlEncodedHttpForm';

describe('HttpClient(request)', () => {
  let bench: HttpClientTBench;

  beforeEach(() => {
    bench = new HttpClientTBench();
    bench.mock.axios.instance.request.resolves(httpResponseGen());
  });

  afterEach(() => {
    bench.restore();
  });

  it('post() with url', () => {
    const url = '/foxy';

    const { http, mock } = bench.mock.http.instance();
    mock.request;

    http.post(url);

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[0]).toBe(url);
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      method: HttpMethod.POST,
    });
  });

  it('post() with data', () => {
    const data = { foxy: 'lady' };

    const { http, mock } = bench.mock.http.instance();
    mock.request;

    http.post('/', data);

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      data,
    });
  });

  it('post() with data & options', () => {
    const
      data = { baz: 'fox' },
      options = {
        headers: { bazyyy: 'bar' },
      };

    const { http, mock } = bench.mock.http.instance();
    mock.request;

    http.post('', data, options);

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      data,
      ...options,
    });
  });

  it('post() does not overwrite data from options', () => {
    const
      data = { baz: 'fox' },
      options = {
        data: { foxy: 'bar' },
      };

    const { http, mock } = bench.mock.http.instance();
    mock.request;

    http.post('', data, options);

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      data,
    });
  });

  it('post() does not overwrite method form options', () => {
    const { http, mock } = bench.mock.http.instance();
    mock.request;

    http.post('', {}, {
      method: HttpMethod.GET,
    });

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      method: HttpMethod.POST,
    });
  });

  it('post() resolves with response', () => {
    const res = httpResponseGen({
      status: HttpStatus.BAD_REQUEST,
    });

    const { http, mock } = bench.mock.http.instance();
    mock.request.resolves(res);

    expect(http.post('')).resolves.toMatchObject({
      status: res.status,
    });
  });

  it('supports UrlEncodedHttpForm', () => {
    const { http, mock } = bench.mock.http.instance();
    mock.request;

    const form = new UrlEncodedHttpForm({ foo: 'baz' });

    http.post('/dummy', form);

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      data: form.toBody(),
      headers: form.getHeaders(),
    });
  });

  it('supports UrlEncodedHttpForm preserving other headers & options passed along', () => {
    const { http, mock } = bench.mock.http.instance();
    mock.request;

    const
      form = new UrlEncodedHttpForm({}),
      cookies = { xyz: 'abc' },
      headers = {
        'Content-Type': 'application/foo',
        abc: 'xyz',
      };

    http.post('/dummy', form, { headers, cookies });

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      headers: {
        ...headers,
        ...form.getHeaders(),
      },
      cookies,
    });
  });

  it('supports UrlEncodedHttpForm de-duplicating existing lower cased content type in headers', () => {
    const { http, mock } = bench.mock.http.instance();
    mock.request;

    const
      form = new UrlEncodedHttpForm({}),
      headers = {
        'content-type': 'application/bar',
        bbc: 'sucks',
      };

    http.post('/dummy', form, { headers });

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      headers: {
        bbc: 'sucks',
        ...form.getHeaders(),
      },
    });
  });
});
