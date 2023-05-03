import * as sinonLib from 'sinon';
import { LooseObject } from '../../../../../common/types';
import { isObj } from '../../../../../common/isType/isType';
import { ClassMockMember } from './ClassMockMember';
import { ClassMockCache } from './ClassMockCache';
import { CONSTRUCTOR_ARGS_KEY, CONSTRUCTOR_KEY, KEEP_ORIG_INSTANCE_KEY, RESTORE_KEY } from './constants';

type Args = [LooseObject]
  | [LooseObject, sinonLib.SinonSandbox]
  | [LooseObject, Spec]
  | [LooseObject, Spec, sinonLib.SinonSandbox];

type Spec = LooseObject;

export const ClassMock = (...args: Args) => {
  /*** Init ***/

  const
    { Module, spec, sinon } = extractArgs(),
    memberMap = defineMembers(),
    className = defineClassName(),
    cache = new ClassMockCache(className);

  const instanceMock = {};
  let constructorMock;

  const origInstance = spec[KEEP_ORIG_INSTANCE_KEY] ? makeOrigInstance() : null;

  /*** Public ***/

  const self = {
    [RESTORE_KEY]: () => { sinon.restore(); },
  };

  return new Proxy({}, {
    get(_, memberName: string) {
      mockConstructor();

      if (memberName === CONSTRUCTOR_KEY) {
        return constructorMock;
      }

      if (cache.has(memberName)) {
        return cache.get(memberName);
      }

      if (self[memberName]) {
        // @ts-ignore
        return (...fnArgs) => self[memberName](...fnArgs);
      }

      const member = findMember(memberName);

      if (!(member instanceof ClassMockMember)) {
        return member;
      }

      instanceMock[member.name] = member.defaultValue;

      // @ts-ignore
      return mockMember(member, sinon.stub(instanceMock, member.name));
    },
  }) as any;

  /*** Private ***/

  function findMember(name): ClassMockMember | Function {
    if (memberMap[name]) {
      return memberMap[name];
    }

    if (origInstance && origInstance[name]) {
      return origInstance[name].bind(instanceMock);
    }

    throw new Error(`Undefined mock member: ${name}`);
  }

  function mockMember(member: ClassMockMember, stub: sinonLib.SinonStub, topLevel: boolean = true) {
    let mock;

    if (member.isStruct) {
      const struct = member.initStruct(
        (m, parent) => mockMember(m, sinon.stub(parent, m.name), false),
      );

      if (topLevel) {
        stub.value(struct.value);
      }

      mock = struct.mock;
    } else {
      mock = member.init(stub);
    }

    return cache.set(member.name, mock);
  }

  function mockConstructor() {
    if (constructorMock) {
      return;
    }
    constructorMock = sinon.stub(Module, className).returns(instanceMock);
  }

  function defineMembers() {
    return Object
      .keys(spec)
      .reduce(
        (acc, memberRef) => {
          const member = new ClassMockMember(memberRef, spec[memberRef]);
          return Object.assign(acc, { [member.name]: member });
        },
        {},
      );
  }

  function defineClassName() {
    const keys = Object.keys(Module);
    if (keys.length) {
      return keys[0];
    }
    throw new Error(`Missing class name in module: ${Module.constructor.name}`);
  }

  function extractArgs() {
    let M, sp = {}, si = sinonLib.createSandbox();

    if (args.length === 1) {
      M = args[0];
      // @ts-ignore: TODO
    } else if (args.length === 2 && isSinon(args[1])) {
      // @ts-ignore: TODO
      ([M, si] = args);
    } else if (args.length === 2) {
      ([M, sp] = args);
    } else if (args.length === 3) {
      ([M, sp, si] = args);
    } else {
      throw new Error('Invalid arguments given');
    }

    return { Module: M, spec: sp, sinon: si };
  }

  function makeOrigInstance() {
    let ctorArgs = [];

    if (spec[CONSTRUCTOR_ARGS_KEY]) {
      ctorArgs = spec[CONSTRUCTOR_ARGS_KEY];
    }

    return new Module[className](...ctorArgs);
  }

  // TODO: improve detection
  function isSinon(input) {
    return isObj(input) && input.assert && input.stub && input.spy;
  }
};
