import * as httpErrors from './index';
import { HttpError } from './index';

describe('httpErrors', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });

  it('properly implements class instances', () => {
    Object.keys(httpErrors).forEach(className => {
      if (className === HttpError.name) {
        return;
      }

      const Class = httpErrors[className];

      expect(new Class()).toBeInstanceOf(Class);
    });
  });

  it('properly implements class names', () => {
    Object.keys(httpErrors).forEach(className => {
      if (className === HttpError.name) {
        return;
      }

      const Class = httpErrors[className];

      expect(new Class().name).toBe(Class.name);
    });
  });
});
