import { HttpStatus } from './HttpStatus';
import { HttpMetaError } from '../HttpMetaError';

export const httpStatusText = (statusCode: HttpStatus): string => {
  if (!HttpStatus[statusCode]) {
    throw new HttpMetaError(`Unknown http status code: ${statusCode}`);
  }

  if (statusCode === HttpStatus.OK) {
    return HttpStatus[HttpStatus.OK];
  }

  return HttpStatus[statusCode]
    .split('_')
    .map(toCamelCase)
    .join(' ');
};

/*** Lib ***/

function toCamelCase(str) {
  return str[0].toUpperCase() + str.substring(1).toLowerCase();
}
