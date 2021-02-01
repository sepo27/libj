import { isArr, isBool, isFn, isNull, isNum, isObj, isStr } from './isType';

describe('$', () => {
  describe('isStr()', () => {
    it('true for string', () => {
      expect(isStr('Blah')).toBeTruthy();
    });

    it('true for empty string', () => {
      expect(isStr('')).toBeTruthy();
    });

    it('false for other types', () => {
      [1, true, false, null, undefined, {}, [], () => {}].forEach(val => {
        expect(isStr(val)).toBeFalsy();
      });
    });
  });

  describe('isNum()', () => {
    it('true for number', () => {
      expect(isNum(1)).toBeTruthy();
    });

    it('false for string number', () => {
      expect(isNum('2')).toBeFalsy();
    });

    it('false for other types', () => {
      ['blah', true, false, null, undefined, {}, [], () => {}].forEach(val => {
        expect(isNum(val)).toBeFalsy();
      });
    });
  });

  describe('isBool()', () => {
    it('true for true', () => {
      expect(isBool(true)).toBeTruthy();
    });

    it('true for false', () => {
      expect(isBool(false)).toBeTruthy();
    });

    it('false for "falsy" values', () => {
      [0, '', null, undefined].forEach(val => {
        expect(isBool(val)).toBeFalsy();
      });
    });

    it('false for other types', () => {
      ['blah', 333, {}, [34], () => {}].forEach(val => {
        expect(isBool(val)).toBeFalsy();
      });
    });
  });

  describe('isNull()', () => {
    it('true for null', () => {
      expect(isNull(null)).toBeTruthy();
    });

    it('false for other types', () => {
      ['blah', 333, true, false, undefined, {}, () => {}].forEach(val => {
        expect(isNull(val)).toBeFalsy();
      });
    });
  });

  describe('isArr()', () => {
    it('true for array', () => {
      expect(isArr([1])).toBeTruthy();
    });

    it('true for empty array', () => {
      expect(isArr([])).toBeTruthy();
    });

    it('false for other types', () => {
      ['blah', 333, true, false, null, undefined, {}, () => {}].forEach(val => {
        expect(isArr(val)).toBeFalsy();
      });
    });
  });

  describe('isObj()', () => {
    it('true for object', () => {
      expect(isObj({ foo: 'bar' })).toBeTruthy();
    });

    it('true for empty object', () => {
      expect(isObj({})).toBeTruthy();
    });

    it('false for array', () => {
      expect(isObj([1])).toBeFalsy();
    });

    it('false for null', () => {
      expect(isObj(null)).toBeFalsy();
    });

    it('false for other types', () => {
      ['blah', 333, true, false, undefined, () => {}].forEach(val => {
        expect(isObj(val)).toBeFalsy();
      });
    });
  });

  describe('isFn()', () => {
    it('true for function', () => {
      expect(isFn(() => {})).toBeTruthy();
    });

    it('false for other types', () => {
      ['blah', 333, true, false, {}, [], null, undefined].forEach(val => {
        expect(isFn(val)).toBeFalsy();
      });
    });
  });
});
