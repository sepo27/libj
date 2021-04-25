import { HttpResponseBody, HttpResponseHeaders, HttpResponseInterface, HttpStatus } from '../index';
import { HttpResponseOptions } from './types';
import { isObj } from '../../../../common/isType/isType';

type Params<B extends HttpResponseBody = HttpResponseBody> =
  []
  | [HttpStatus]
  | [HttpResponseOptions<B>]
  | [HttpStatus, HttpResponseOptions<B>];

const DEFAULT_STATUS = HttpStatus.OK;
export { DEFAULT_STATUS as DEFAULT_SUCCESS_HTTP_RESPONSE_STATUS };

export class SuccessHttpResponse<B extends HttpResponseBody = HttpResponseBody> implements HttpResponseInterface {
  constructor(...params: Params<B>) {
    const { status, headers, body } = extractParams(params);

    this.status = status;
    this.headers = headers;
    this.body = body;
  }

  public readonly status: HttpStatus;
  public readonly headers: HttpResponseHeaders;
  public readonly body: B;
}

/*** Lib ***/

function extractParams(params) {
  let status, headers = {}, body = {} as any;

  if (params.length === 0) {
    status = DEFAULT_STATUS;
  } else if (params.length === 1 && Number.isInteger(params[0])) {
    status = params[0] as HttpStatus;
  } else if (params.length === 1 && isObj(params[0])) {
    status = DEFAULT_STATUS;
    ({ headers, body } = params[0]);
  } else if (params.length === 2) {
    status = params[0];
    ({ headers, body } = params[1]);
  }

  return { status, headers, body };
}
