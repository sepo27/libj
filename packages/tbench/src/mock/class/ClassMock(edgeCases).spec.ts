import * as sinonLib from 'sinon';
import { ClassMock } from './ClassMock';
import * as ClassModule from './.spec/class';

describe('ClassMock', () => {
  let sinon;

  beforeEach(() => {
    sinon = sinonLib.createSandbox();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('reuses the same property mock', () => {
    const mock = makeMock({
      foo: null,
    });

    const a = mock.foo;
    const b = mock.foo;

    expect(a).toBe(b);
  });

  it('reuses the same method mock', () => {
    const mock = makeMock({
      'bar()': null,
    });

    const a = mock.bar;
    const b = mock.bar;

    expect(a).toBe(b);
  });

  it('reuses the same nested mock', () => {
    const mock = makeMock({
      hex: {
        foo: null,
        'bar()': null,
      },
    });

    const a = mock.hex;
    const b = mock.hex;

    expect(a).toBe(b);
  });

  it('errors out for undefined member', () => {
    const mock = makeMock({ foo: null });
    expect(() => mock.dummy).toThrow(new Error('Undefined mock member: dummy'));
  });

  it('errors out when missing class name in module', () => {
    const Module = {};
    expect(
      () => ClassMock(Module),
    ).toThrow(new Error(`Missing class name in module: ${Module.constructor.name}`));
  });

  /*** Lib ***/

  function makeMock(spec = {}) {
    return ClassMock(ClassModule, spec, sinon);
  }
});
