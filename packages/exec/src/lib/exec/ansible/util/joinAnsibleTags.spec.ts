import { joinAnsibleTags } from './joinAnsibleTags';

describe('joinAnsibleTags()', () => {
  it('returns single tag as is', () => {
    expect(joinAnsibleTags('foo')).toBe('foo');
  });

  it('joins multiple tags', () => {
    const tags = ['foo', 'bar'];
    expect(joinAnsibleTags(tags)).toBe(tags.join(','));
  });
});
