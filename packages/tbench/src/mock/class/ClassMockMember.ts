import * as sinonLib from 'sinon';
import { isFn, isObj } from '../../../../../common/isType/isType';
import { LooseObject } from '../../../../../common/types';

const MethodPattern = /\(\)$/;

// eslint-disable-next-line no-unused-vars
type InitStructCallback = (module: ClassMockMember, parent: LooseObject) => sinonLib.SinonStub;

interface Struct {
  value: LooseObject,
  mock: LooseObject,
}

export class ClassMockMember {
  // eslint-disable-next-line no-useless-constructor, no-empty-function, no-unused-vars
  constructor(private ref: string, private initializer: any) {}

  /*** Public ***/

  public init(stub: sinonLib.SinonStub) {
    if (isFn(this.initializer)) {
      return this.initializer(stub);
    }

    return this.isMethod
      ? stub.returns(this.initializer)
      : stub.value(this.initializer);
  }

  public initStruct(cb: InitStructCallback): Struct {
    if (this.$struct) {
      return this.$struct;
    }

    return (
      this.$struct = Object
        .keys(this.initializer)
        .reduce(
          (acc, ref) => {
            const m = new ClassMockMember(ref, this.initializer[ref]);

            acc.value[m.name] = m.defaultValue;
            acc.mock[m.name] = cb(m, acc.value);

            return acc;
          },
          { value: {}, mock: {} },
        )
    );
  }
  private $struct;

  public get name(): string { return this.ref.replace(MethodPattern, ''); }

  public get defaultValue() { return this.isMethod ? () => {} : null; }

  public get isStruct(): boolean { return isObj(this.initializer); }

  public static RESTORE = '$restore';

  /*** Private ***/

  private get isMethod(): boolean { return MethodPattern.test(this.ref); }
}
