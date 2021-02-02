import { UriPart } from './UriPart';
import { trimUriPath } from './trimUriPath';

const
  NonPathCharset = [UriPart.DOT, UriPart.COLON, UriPart.QM, UriPart.HASH],
  NonPathCheckPattern = new RegExp(`[${NonPathCharset.join('')}]`);

export const joinUriPath = (...parts: string[]): string => { // eslint-disable-line
  let res = parts.map(trimUriPath).join(UriPart.SLASH);

  if (!NonPathCheckPattern.test(res)) {
    res = `${UriPart.SLASH}${res}`;
  }

  return res;
};
