export const
  isStr = (val: any): boolean => typeof val === 'string',
  isNum = (val: any): boolean => typeof val === 'number',
  isBool = (val: any): boolean => typeof val === 'boolean',
  isNull = (val: any): boolean => val === null,
  isArr = (val: any): boolean => Array.isArray(val),
  isObj = (val: any): boolean => typeof val === 'object' && !isArr(val) && !isNull(val),
  isFn = (val: any): boolean => typeof val === 'function',
  isRegex = (val: any): boolean => (val instanceof RegExp);

export const isEnumVal = (Enum: Object, val: string | number): boolean => (
  Object.values(Enum).indexOf(val) > -1
);
