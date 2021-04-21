import { SuccessHttpResponse } from './SuccessHttpResponse';
import { HttpStatus } from '../status/HttpStatus';

describe('SuccessHttpResponse', () => {
  it('assigns default OK status', () => {
    const res = new SuccessHttpResponse();
    expect(res.status).toBe(HttpStatus.OK);
  });

  it('assigns custom status', () => {
    const
      status = HttpStatus.CREATED,
      res = new SuccessHttpResponse(status);

    expect(res.status).toBe(status);
  });

  it('assigns custom status & headers', () => {
    const
      status = HttpStatus.ACCEPTED,
      headers = { foxy: 'lady' },
      res = new SuccessHttpResponse(status, { headers });

    expect(res.status).toBe(status);
    expect(res.headers).toBe(headers);
  });

  it('assigns custom status & body', () => {
    const
      status = HttpStatus.ACCEPTED,
      body = { bar: 'bazzzzzzz' },
      res = new SuccessHttpResponse(status, { body });

    expect(res.status).toBe(status);
    expect(res.body).toBe(body);
  });

  it('assigns custom status & headers & body', () => {
    const
      status = HttpStatus.ACCEPTED,
      headers = { foo: 'bar' },
      body = { baz: 'fox' },
      res = new SuccessHttpResponse(status, { headers, body });

    expect(res.status).toBe(status);
    expect(res.headers).toBe(headers);
    expect(res.body).toBe(body);
  });

  it('assigns custom headers only', () => {
    const
      headers = { 'content-type': 'application/json' },
      res = new SuccessHttpResponse({ headers });

    expect(res.headers).toBe(headers);
  });

  it('assigns custom body only', () => {
    const
      body = { ok: true },
      res = new SuccessHttpResponse({ body });

    expect(res.body).toBe(body);
  });

  it('assigns custom headers & body', () => {
    const
      headers = { 'Content-Type': 'text' },
      body = { ok: false },
      res = new SuccessHttpResponse({ headers, body });

    expect(res.headers).toBe(headers);
    expect(res.body).toBe(body);
  });
});
