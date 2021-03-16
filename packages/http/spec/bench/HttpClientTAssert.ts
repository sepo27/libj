import { HttpClientTMock } from './HttpClientTMock';
import { isArr, isObj } from '../../../../common/isType/isType';

export class HttpClientTAssert {
  constructor(private mock: HttpClientTMock) {
    this.axios = {
      main: {
        create: {
          calledOnce: this.makeCalledOnce(this.mock.axios.main.create),
        },
      },
      instance: {
        request: {
          calledOnce: this.makeCalledOnce(this.mock.axios.instance.request),
        },
      },
    };
  }

  /*** Public ***/

  public readonly axios;

  /*** Private ***/

  private makeCalledOnce(fnMock) {
    return (...expectedArgs) => {
      expect(fnMock.calledOnce).toBeTruthy();

      const actualArgs = fnMock.getCall(0).args;

      if (expectedArgs.length) {
        if (expectedArgs.some(a => a === undefined)) {
          expectedArgs.forEach((arg, i) => {
            if (arg !== undefined) {
              if (isObj(arg) || isArr(arg)) {
                expect(actualArgs[i]).toMatchObject(arg);
              } else {
                expect(actualArgs[i]).toEqual(arg);
              }
            }
          });
        } else {
          expect(actualArgs).toMatchObject(expectedArgs);
        }
      }
    };
  }
}
