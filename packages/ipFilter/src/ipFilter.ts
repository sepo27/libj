import * as ipRangeCheck from 'ip-range-check';

export const ipFilter = (addr: string, range: string | string[]): boolean => ipRangeCheck(addr, range);
