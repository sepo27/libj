import { MakeUriBaseUri as BaseUri } from '../src/MakeUriBaseUri';
import { MakeUriError } from '../src/MakeUriError';

describe('MakeUriBaseUri', () => {
  it('invalidates scheme-without-authority with path', () => {
    assertInvalidUri('http:///path');
  });

  it('invalidates scheme-without-authority with query', () => {
    assertInvalidUri('http://?foo=bar');
  });

  it('invalidates scheme-without-authority with #fragment', () => {
    assertInvalidUri('http://#foo=bar');
  });

  it('detects empty', () => {
    expect(new BaseUri('').empty).toBeTruthy();
  });
});

/*** Util ***/

function assertInvalidUri(uri) {
  expect(() => new BaseUri(uri))
    .toThrow(new MakeUriError(`Invalid base uri given: ${uri}`));
}
