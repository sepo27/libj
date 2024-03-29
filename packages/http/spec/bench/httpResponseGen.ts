import { HttpResponse } from '../../src/client/types';
import { HttpStatus, httpStatusText } from '../../../httpMeta/src';

type Input = Partial<HttpResponse>;

const Default = {
  data: {},
  status: HttpStatus.OK,
  statusText: httpStatusText(HttpStatus.OK),
  headers: {},
  config: {},
};

export const httpResponseGen = (input: Input = {}): HttpResponse => ({
  ...Default,
  ...input,
});
