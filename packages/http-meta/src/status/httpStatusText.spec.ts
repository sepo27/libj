import { HttpStatus } from './HttpStatus';
import { httpStatusText } from './httpStatusText';
import { HttpMetaError } from '../HttpMetaError';

describe('httpStatusText()', () => {
  it('maps single word status', () => {
    expect(httpStatusText(HttpStatus.CREATED)).toBe('Created');
  });

  it('maps 200 OK as special case to all caps', () => {
    expect(httpStatusText(HttpStatus.OK)).toBe('OK');
  });

  it('maps multi word status', () => {
    expect(httpStatusText(HttpStatus.NO_CONTENT)).toBe('No Content');
  });

  it('errors out for unknown status code', () => {
    const
      dummyStatusCode = 1234,
      fn = () => httpStatusText(dummyStatusCode);

    // TODO: use custom assertion
    expect(fn).toThrowError(HttpMetaError);
    expect(fn).toThrowError(
      new HttpMetaError(`Unknown http status code: ${dummyStatusCode}`),
    );
  });
});
