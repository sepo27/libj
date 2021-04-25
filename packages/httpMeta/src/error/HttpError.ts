import { HttpResponseInterface } from '../response/HttpResponseInterface';
import { HttpResponseBody, HttpResponseHeaders, HttpResponseOptions } from '../response/types';
import { HttpStatus } from '../status/HttpStatus';
import { httpStatusText } from '../status/httpStatusText';

export class HttpError<B extends HttpResponseBody = HttpResponseBody>
  extends Error
  implements HttpResponseInterface<B>
{ // eslint-disable-line brace-style
  constructor(status: HttpStatus, { headers, body }: HttpResponseOptions<B> = {}) {
    super(msg(status, body));

    // Set the prototype explicitly
    Object.setPrototypeOf(this, HttpError.prototype);
    this.name = HttpError.name;

    this.status = status;
    this.headers = headers;
    this.body = body;
  }

  public readonly status: HttpStatus;
  public readonly body: B = {} as any;
  public readonly headers: HttpResponseHeaders = {};
}

/*** Lib ***/

function msg(status, body) {
  validateStatus(status);

  let res = `${status} ${httpStatusText(status)}`;

  if (body) {
    res += `: ${JSON.stringify(body)}`;
  }

  return res;
}

function validateStatus(status) {
  if (!(status >= 400)) {
    throw new Error(`Invalid status code supplied for ${HttpError.name}: ${status}`);
  }
}
