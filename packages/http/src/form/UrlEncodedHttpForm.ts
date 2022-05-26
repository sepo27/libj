import { LooseObject } from '../../../../common/types';
import { makeUri } from '../../../makeUri/src/makeUri';

export class UrlEncodedHttpForm {
  // eslint-disable-next-line no-empty-function,no-useless-constructor
  constructor(private data: LooseObject) {}

  toBody(): string {
    return makeUri({ query: { $data: this.data, $options: { encode: true } } });
  }

  getHeaders(): LooseObject {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }
}
