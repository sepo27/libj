import { baz } from './baz';
import { foo } from '../../foo/src';

export const bar = (): boolean => {
  console.log('barrrr', baz(), foo());
  return true;
};
