import { LooseObject } from '../../../../common/types';

export type HttpResponseBody = LooseObject;

export type HttpResponseHeaders = LooseObject;

export interface HttpResponseOptions<B extends HttpResponseBody = HttpResponseBody> {
  headers?: HttpResponseHeaders,
  body?: B,
}
