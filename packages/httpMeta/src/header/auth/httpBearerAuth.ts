import { HttpAuthScheme } from './HttpAuthScheme';
import { UnauthorizedHttpError } from '../../error';

export const makeHttpBearerAuth = (token: string): string => {
  if (!token || !token.trim()) {
    throw new Error('Bearer token is empty');
  }
  return `${HttpAuthScheme.BEARER} ${token.trim()}`;
};

interface ParseOptions {
  silent?: boolean,
}

export const parseHttpBearerAuthToken = (auth: string, options: ParseOptions = {}): string | null => {
  const parts = auth && auth.split(HttpAuthScheme.BEARER);

  if (parts && parts.length === 2 && parts[1].trim()) {
    return parts[1].trim();
  }

  if (options.silent) {
    return null;
  }

  throw new UnauthorizedHttpError();
};
