import { HttpStatus } from '../status/HttpStatus';
import { HttpResponseBody, HttpResponseHeaders } from './types';

export interface HttpResponseInterface<B extends HttpResponseBody = HttpResponseBody> {
  readonly status: HttpStatus;
  readonly headers: HttpResponseHeaders;
  readonly body: B;
}
