import { HttpClientTBench } from '../bench/HttpClientTBench';
import { httpResponseGen } from '../bench/httpResponseGen';
import { HttpStatus, HttpMethod } from '../../../httpMeta/src';

describe('HttpClient(request)', () => {
  let bench: HttpClientTBench;

  beforeEach(() => {
    bench = new HttpClientTBench();
    bench.mock.axios.instance.request.resolves(httpResponseGen());
  });

  afterEach(() => {
    bench.restore();
  });

  it('get() with url', () => {
    const url = '/foo';

    const { http, mock } = bench.mock.http.instance();
    mock.request;

    http.get(url);

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[0]).toBe(url);
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      method: HttpMethod.GET,
    });
  });

  it('get() with options', () => {
    const options = {
      headers: { foo: 'bar' },
    };

    const { http, mock } = bench.mock.http.instance();
    mock.request;

    http.get('', options);

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[1]).toMatchObject(options);
  });

  it('get() does not overwrite method', () => {
    const { http, mock } = bench.mock.http.instance();
    mock.request;

    http.get('', {
      method: HttpMethod.POST,
    });

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      method: HttpMethod.GET,
    });
  });

  it('get() resolves with response', () => {
    const res = httpResponseGen({
      status: HttpStatus.BAD_REQUEST,
    });

    const { http, mock } = bench.mock.http.instance();
    mock.request.resolves(res);

    expect(http.get('')).resolves.toMatchObject({
      status: res.status,
    });
  });
});
