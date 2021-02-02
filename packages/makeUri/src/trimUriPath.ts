import { UriPart } from './UriPart';

const Pattern = {
  All: new RegExp(`^${UriPart.SLASH}|${UriPart.SLASH}$`, 'g'),
  Left: new RegExp(`^${UriPart.SLASH}`),
  Right: new RegExp(`${UriPart.SLASH}$`),
};

export const
  trimUriPath = (val: string): string => val.replace(Pattern.All, ''),
  ltrimUriPath = (val: string): string => val.replace(Pattern.Left, ''),
  rtrimUriPath = (val: string): string => val.replace(Pattern.Right, '');
