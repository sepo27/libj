import { HttpResponseBody, HttpResponseHeaders } from '../responseInterface/types';

export type HttpErrorOptions<B extends HttpResponseBody = HttpResponseBody> = {
  body?: B,
  headers?: HttpResponseHeaders,
};
