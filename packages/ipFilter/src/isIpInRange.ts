import * as ipRangeCheck from 'ip-range-check';

export const isIpInRange = (addr: string, range: string | string[]): boolean => ipRangeCheck(addr, range);
