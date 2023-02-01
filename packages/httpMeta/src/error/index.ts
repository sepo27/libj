/* eslint-disable max-classes-per-file */

import { HttpError } from './HttpError';
import { HttpResponseBody, HttpResponseOptions } from '../response/types';
import { HttpStatus } from '../status/HttpStatus';

export { HttpError };

export class BadRequestHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.BAD_REQUEST, options);
    this.name = BadRequestHttpError.name;
  }
}

export class UnauthorizedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.UNAUTHORIZED, options);
    this.name = UnauthorizedHttpError.name;
  }
}

export class ForbiddenHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.FORBIDDEN, options);
    this.name = ForbiddenHttpError.name;
  }
}

export class NotFoundHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.NOT_FOUND, options);
    this.name = NotFoundHttpError.name;
  }
}

export class MethodNotAllowedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.METHOD_NOT_ALLOWED, options);
    this.name = MethodNotAllowedHttpError.name;
  }
}

export class NotAcceptableHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.NOT_ACCEPTABLE, options);
    this.name = NotAcceptableHttpError.name;
  }
}

export class ConflictHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.CONFLICT, options);
    this.name = ConflictHttpError.name;
  }
}

export class PreconditionFailedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.PRECONDITION_FAILED, options);
    this.name = PreconditionFailedHttpError.name;
  }
}

export class InternalServerHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, options);
    this.name = InternalServerHttpError.name;
  }
}

export class NotImplementedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.NOT_IMPLEMENTED, options);
    this.name = NotImplementedHttpError.name;
  }
}

export class BadGatewayHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.BAD_GATEWAY, options);
    this.name = BadGatewayHttpError.name;
  }
}

export class ServiceUnavailableHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.SERVICE_UNAVAILABLE, options);
    this.name = ServiceUnavailableHttpError.name;
  }
}

export class GatewayTimeoutHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.GATEWAY_TIMEOUT, options);
    this.name = GatewayTimeoutHttpError.name;
  }
}
