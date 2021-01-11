import { baz } from './baz';
// import { foo } from '../../foo/src';

export const bar = (): boolean => {
  // console.log('bar', baz(), foo());
  console.log('bar', baz());
  return true;
};
