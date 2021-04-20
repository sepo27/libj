export const
  bundlePackageGlobPattern = (pattern: string = '*') => `${pattern}.{js,ts}`,
  bundlePackageGlobNestedPattern = () => bundlePackageGlobPattern('**/*');
