/* eslint-disable max-classes-per-file */

import { HttpError } from './HttpError';
import { HttpResponseBody, HttpResponseOptions } from '../response/types';
import { HttpStatus } from '../status/HttpStatus';

export { HttpError };

export class BadRequestHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.BAD_REQUEST, options);
  }
}

export class UnauthorizedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.UNAUTHORIZED, options);
  }
}

export class ForbiddenHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.FORBIDDEN, options);
  }
}

export class NotFoundHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.NOT_FOUND, options);
  }
}

export class MethodNotAllowedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.METHOD_NOT_ALLOWED, options);
  }
}

export class NotAcceptableHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.NOT_ACCEPTABLE, options);
  }
}

export class ConflictHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.CONFLICT, options);
  }
}

export class PreconditionFailedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.PRECONDITION_FAILED, options);
  }
}

export class InternalServerHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, options);
  }
}

export class NotImplementedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.NOT_IMPLEMENTED, options);
  }
}

export class BadGatewayHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.BAD_GATEWAY, options);
  }
}

export class ServiceUnavailableHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.SERVICE_UNAVAILABLE, options);
  }
}

export class GatewayTimeoutHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.GATEWAY_TIMEOUT, options);
  }
}
