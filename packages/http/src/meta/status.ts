import { ValueOf } from '../../../../common/types';

export const HttpStatus = {
  /*** 2xx ***/

  OK: 200,

  /*** 4xx ***/

  BAD_REQUEST: 400,
  UPROCESSABLE_ENTITY: 422,
};

export type HttpStatusCode = ValueOf<typeof HttpStatus>;

const HttpStatusText = {
  /*** 2xx ***/

  [HttpStatus.OK]: 'OK',

  /*** 4xx ***/

  [HttpStatus.BAD_REQUEST]: 'Bard Request',
  [HttpStatus.UPROCESSABLE_ENTITY]: 'Unprocessable Entity',
};

type HttpStatusTextT = ValueOf<typeof HttpStatusText>;

export const httpStatusText = (code: HttpStatusCode): HttpStatusTextT => HttpStatusText[code];
