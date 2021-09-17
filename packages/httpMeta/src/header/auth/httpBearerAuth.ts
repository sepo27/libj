import { HttpAuthScheme } from './HttpAuthScheme';

export const makeHttpBearerAuth = (token: string): string => {
  if (!token || !token.trim()) {
    throw new Error('Bearer token is empty');
  }
  return `${HttpAuthScheme.BEARER} ${token.trim()}`;
};

export const parseHttpBearerAuthToken = (auth: string): string => {
  const parts = auth.split(HttpAuthScheme.BEARER);

  if (parts.length === 2) {
    return parts[1].trim();
  }

  throw new Error(`Unable to parse bearer token from auth: ${auth}`);
};
