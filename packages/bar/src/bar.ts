import { baz } from './baz';
import { foo } from '../../foo/src';
import { dummyFromCommon } from '../../../common/dummyFromCommon';

export const bar = (): boolean => {
  console.log('bar', baz(), foo(), dummyFromCommon());
  return true;
};
