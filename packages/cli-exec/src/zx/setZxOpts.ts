import { $ } from 'zx';
import { ZxOpts } from './ZxOpts';

export const setZxOpts = (opts: ZxOpts) => {
  Object.keys(opts).forEach(o => {
    $[o] = opts[o];
  });
};
