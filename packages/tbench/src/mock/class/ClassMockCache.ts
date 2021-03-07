import * as sinonLib from 'sinon';
import { LooseObject } from '../../../../../common/types';

export class ClassMockCache {
  // eslint-disable-next-line no-useless-constructor,no-unused-vars,no-empty-function
  constructor(private className: string) {}

  /*** Public ***/

  public has(member: string): boolean {
    return !!(this.bag[this.className] && this.bag[this.className][member]);
  }

  public get(member: string): sinonLib.SinonStub {
    return this.bag[this.className][member];
  }

  // TODO: return type
  public set(member: string, mock) {
    if (!this.bag[this.className]) {
      this.bag[this.className] = {};
    }
    this.bag[this.className][member] = mock;
    return mock;
  }

  /*** Private ***/

  private bag: LooseObject = {};
}
