import { HttpAuthScheme } from './HttpAuthScheme';
import { makeHttpBearerAuth, parseHttpBearerAuthToken } from './httpBearerAuth';
import { UnauthorizedHttpError } from '../../error';

describe('makeHttpBearerAuth()', () => {
  it('makes auth for some token', () => {
    const token = 'abc';
    expect(makeHttpBearerAuth(token)).toBe(`${HttpAuthScheme.BEARER} ${token}`);
  });

  it('trims the token', () => {
    const token = ' adsfadsf ';
    expect(makeHttpBearerAuth(token)).toBe(`${HttpAuthScheme.BEARER} ${token.trim()}`);
  });

  it('errors out for empty token', () => {
    [null, undefined, '', ' '].forEach(token => {
      expect(() => makeHttpBearerAuth(token)).toThrow(new Error('Bearer token is empty'));
    });
  });
});

describe('parseHttpBearerAuthToken()', () => {
  it('parses token from valid auth', () => {
    const
      token = 'foo-bar',
      auth = makeHttpBearerAuth(token);

    expect(parseHttpBearerAuthToken(auth)).toBe(token);
  });

  it('parses token from auth with spaces', () => {
    const
      token = 'bar-foo',
      auth = `  ${HttpAuthScheme.BEARER}  ${token}  `;

    expect(parseHttpBearerAuthToken(auth)).toBe(token);
  });

  it('errors out for auth with invalid scheme', () => {
    const auth = `${HttpAuthScheme.BASIC} abcd-efgh`;

    expect(() => parseHttpBearerAuthToken(auth)).toThrow(
      new UnauthorizedHttpError(),
    );
  });

  it('errors out for auth with invalid scheme #2', () => {
    const auth = `${HttpAuthScheme.BEARER} abcd-efgh ${HttpAuthScheme.BEARER}`;

    expect(() => parseHttpBearerAuthToken(auth)).toThrow(
      new UnauthorizedHttpError(),
    );
  });

  it('errors out for auth with invalid scheme #3', () => {
    const auth = 'bar';

    expect(() => parseHttpBearerAuthToken(auth)).toThrow(
      new UnauthorizedHttpError(),
    );
  });

  it('errors out for auth with invalid scheme #4', () => {
    const auth = `${HttpAuthScheme.BEARER} `;

    expect(() => parseHttpBearerAuthToken(auth)).toThrow(
      new UnauthorizedHttpError(),
    );
  });

  it('provides ability to return null when unable to parse token', () => {
    [
      '',
      ' ',
      null,
      undefined,
      `${HttpAuthScheme.BASIC} `,
      `${HttpAuthScheme.BASIC} abcd-efgh`,
      `${HttpAuthScheme.BEARER} `,
      `${HttpAuthScheme.BASIC} abcd-efgh ${HttpAuthScheme.BASIC}`,
    ].forEach(auth => {
      expect(parseHttpBearerAuthToken(auth, { silent: true })).toBeNull();
    });
  });
});
