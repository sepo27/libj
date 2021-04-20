import { HttpError } from './HttpError';
import { HttpStatus } from '../status/HttpStatus';
import { httpStatusText } from '../status/httpStatusText';

describe('HttpError', () => {
  it('constructs message with status only', () => {
    const
      status = HttpStatus.BAD_REQUEST,
      err = new HttpError(status);

    expect(err.message).toBe(`${status} ${httpStatusText(status)}`);
  });

  it('assigns status', () => {
    const
      status = HttpStatus.NOT_FOUND,
      err = new HttpError(status);

    expect(err.status).toBe(status);
  });

  it('constructs message with status & body', () => {
    const
      status = HttpStatus.UNAUTHORIZED,
      body = { foo: 'bar' },
      err = new HttpError(status, { body });

    expect(err.message).toBe(`${status} ${httpStatusText(status)}: ${JSON.stringify(body)}`);
  });

  it('assigns body', () => {
    const
      body = { bar: 'baz' },
      err = new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, { body });

    expect(err.body).toBe(body);
  });

  it('assigns headers', () => {
    const
      headers = { bar: 'baz' },
      err = new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, { headers });

    expect(err.headers).toBe(headers);
  });

  it('fails to construct for non-http-error status', () => {
    const invalidStatusCodes = Object.values(HttpStatus).filter(v => v < 400);
    invalidStatusCodes.forEach(status => {
      expect(
        // @ts-ignore
        () => new HttpError(status),
      ).toThrow(new Error(`Invalid status code supplied for ${HttpError.name}: ${status}`));
    });
  });
});
