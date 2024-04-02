export const joinAnsibleTags = (tags: string | string[]): string => (
  Array.isArray(tags) ? tags.join(',') : tags
);
