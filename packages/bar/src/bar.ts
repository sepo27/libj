import { baz } from './baz';
import { foo } from '../../foo/src/foo';

export const bar = () => console.log(foo(), baz());
