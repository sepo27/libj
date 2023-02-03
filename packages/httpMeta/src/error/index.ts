/* eslint-disable max-classes-per-file */

import { HttpError } from './HttpError';
import { HttpResponseBody, HttpResponseOptions } from '../response/types';
import { HttpStatus } from '../status/HttpStatus';

export { HttpError };

export class BadRequestHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.BAD_REQUEST, options);
    Object.setPrototypeOf(this, BadRequestHttpError.prototype);
    this.name = BadRequestHttpError.name;
  }
}

export class UnauthorizedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.UNAUTHORIZED, options);
    Object.setPrototypeOf(this, UnauthorizedHttpError.prototype);
    this.name = UnauthorizedHttpError.name;
  }
}

export class ForbiddenHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.FORBIDDEN, options);
    Object.setPrototypeOf(this, ForbiddenHttpError.prototype);
    this.name = ForbiddenHttpError.name;
  }
}

export class NotFoundHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.NOT_FOUND, options);
    Object.setPrototypeOf(this, NotFoundHttpError.prototype);
    this.name = NotFoundHttpError.name;
  }
}

export class MethodNotAllowedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.METHOD_NOT_ALLOWED, options);
    Object.setPrototypeOf(this, MethodNotAllowedHttpError.prototype);
    this.name = MethodNotAllowedHttpError.name;
  }
}

export class NotAcceptableHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.NOT_ACCEPTABLE, options);
    Object.setPrototypeOf(this, NotAcceptableHttpError.prototype);
    this.name = NotAcceptableHttpError.name;
  }
}

export class ConflictHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.CONFLICT, options);
    Object.setPrototypeOf(this, ConflictHttpError.prototype);
    this.name = ConflictHttpError.name;
  }
}

export class PreconditionFailedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.PRECONDITION_FAILED, options);
    Object.setPrototypeOf(this, PreconditionFailedHttpError.prototype);
    this.name = PreconditionFailedHttpError.name;
  }
}

export class InternalServerHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, options);
    Object.setPrototypeOf(this, InternalServerHttpError.prototype);
    this.name = InternalServerHttpError.name;
  }
}

export class NotImplementedHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.NOT_IMPLEMENTED, options);
    Object.setPrototypeOf(this, NotImplementedHttpError.prototype);
    this.name = NotImplementedHttpError.name;
  }
}

export class BadGatewayHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.BAD_GATEWAY, options);
    Object.setPrototypeOf(this, BadGatewayHttpError.prototype);
    this.name = BadGatewayHttpError.name;
  }
}

export class ServiceUnavailableHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.SERVICE_UNAVAILABLE, options);
    Object.setPrototypeOf(this, ServiceUnavailableHttpError.prototype);
    this.name = ServiceUnavailableHttpError.name;
  }
}

export class GatewayTimeoutHttpError<B extends HttpResponseBody = HttpResponseBody> extends HttpError {
  constructor(options: HttpResponseOptions<B> = {}) {
    super(HttpStatus.GATEWAY_TIMEOUT, options);
    Object.setPrototypeOf(this, GatewayTimeoutHttpError.prototype);
    this.name = GatewayTimeoutHttpError.name;
  }
}
