import { LooseObject } from '../../../../common/types';
import { HttpHeaders } from '../client/types';
import { HttpStatusCode, httpStatusText } from '../meta/status';

interface Options<D> {
  data?: D,
  headers?: HttpHeaders,
}

export class HttpResponseError<D = LooseObject> extends Error {
  constructor(status: HttpStatusCode, { data, headers = {} }: Options<D> = {}) {
    super(msg(status, data));

    // Set the prototype explicitly
    Object.setPrototypeOf(this, HttpResponseError.prototype);
    this.name = HttpResponseError.name;

    this.status = status;
    this.data = data;
    this.headers = headers;
  }

  public readonly status: HttpStatusCode;
  public readonly data: D;
  public readonly headers: HttpHeaders;
}

function msg(status, data) {
  let res = `${status} ${httpStatusText(status)}`;
  if (data) {
    res += ` ${JSON.stringify(data)}`;
  }
  return res;
}
