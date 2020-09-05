import { baz } from './baz';
import { foo } from '../../foo/src';

export const bar = () => console.log(baz(), foo());
