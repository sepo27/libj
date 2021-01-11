import { baz } from './baz';
import { foo } from '../../foo/src';

export const bar = (): boolean => {
  console.log('barr', baz(), foo());
  return true;
};
