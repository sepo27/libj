import { baz } from './baz';
import { foo } from '../../foo/src';

export const bar = (): any => console.log('barr', baz(), foo());
