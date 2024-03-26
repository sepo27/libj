export const ZxOptsList = [
  'verbose',
  'allowSubScript',
] as const;

export type ZxOpts = { [K in typeof ZxOptsList[number]]?: any };
