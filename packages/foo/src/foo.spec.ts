import { foo } from './foo';

describe('foo', () => {
  it('test', () => {
    expect(foo()).toBe('foo');
  });
});
