export const
  isStr = (val: any): boolean => typeof val === 'string',
  isNum = (val: any): boolean => typeof val === 'number',
  isBool = (val: any): boolean => typeof val === 'boolean',
  isNull = (val: any): boolean => val === null,
  isArr = (val: any): boolean => Array.isArray(val),
  isObj = (val: any): boolean => typeof val === 'object' && !isArr(val) && !isNull(val),
  isFn = (val: any): boolean => typeof val === 'function';
