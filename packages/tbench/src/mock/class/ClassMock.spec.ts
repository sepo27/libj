import * as sinonLib from 'sinon';
import { ClassMock } from './ClassMock';
import * as ClassModule from './.spec/class';
import { _TestClassMock } from './.spec/class';

describe('ClassMock', () => {
  let sinon;

  beforeEach(() => {
    sinon = sinonLib.createSandbox();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('mocks constructor', () => {
    const mock = makeMock();

    instance('foo');

    expect(mock.$constructor.getCall(0).args).toEqual(['foo']);
  });

  it('mocks instance property with default value', () => {
    const mock = makeMock({ foo: 'bar' });
    mock.foo;

    expect(instance().foo).toBe('bar');
  });

  it('mocks instance property', () => {
    const mock = makeMock({ foo: null });
    mock.foo.value('At the bar');

    expect(instance().foo).toBe('At the bar');
  });

  it('mocks instance property several times', () => {
    const mock = makeMock({ foo: null });

    mock.foo.value('bar');
    expect(instance().foo).toBe('bar');

    mock.foo.value('bazzzz');
    expect(instance().foo).toBe('bazzzz');
  });

  it('mocks instance property with initialization', () => {
    const mock = makeMock({
      foo: stub => stub.value('foxy lady'),
    });
    mock.foo;

    expect(instance().foo).toBe('foxy lady');
  });

  it('mocks instance property with initialization and overwrite', () => {
    const mock = makeMock({ foo: 'foxy lady' });

    mock.foo;
    expect(instance().foo).toBe('foxy lady');

    mock.foo.value('stuff');
    expect(instance().foo).toBe('stuff');
  });

  it('mocks instance method', () => {
    const mock = makeMock({ 'bar()': null });
    mock.bar.returns('The Bar');

    expect(instance().bar()).toBe('The Bar');
  });

  it('mocks instance method several times', () => {
    const mock = makeMock({ 'bar()': null });

    mock.bar.returns('bar');
    expect(instance().bar()).toBe('bar');

    mock.bar.returns('foxxyyy');
    expect(instance().bar()).toBe('foxxyyy');
  });

  it('mocks instance method with initialization', () => {
    const mock = makeMock({
      'bar()': stub => stub.returns('Marry'),
    });
    mock.bar;

    expect(instance().bar()).toBe('Marry');
  });

  it('mocks instance method with complex initialization', () => {
    const mock = makeMock({
      'bar()': stub => {
        stub.withArgs('baz').returns('foo');
        stub.returns('The Stuff');
        return stub;
      },
    });
    mock.bar;

    expect(instance().bar('baz')).toBe('foo');
    expect(instance().bar()).toBe('The Stuff');
  });

  it('mocks instance method with initialization and overwrite', () => {
    const mock = makeMock({ 'bar()': 'Marry' });

    mock.bar.returns('The Marry');
    expect(instance().bar()).toBe('The Marry');
  });

  it('mocks instance with nested structure', () => {
    const mock = makeMock({
      hex: {
        bar: null,
        'baz()': null,
      },
    });
    mock.hex.bar.value('foo...bar');
    mock.hex.baz.returns('bazzzz');

    expect(instance().hex.bar).toBe('foo...bar');
    expect(instance().hex.baz()).toBe('bazzzz');
  });

  it('mocks instance with nested structure and some siblings', () => {
    const mock = makeMock({
      hex: {
        'baz()': null,
      },
      fox: null,
    });
    mock.hex.baz.returns('bar');
    mock.fox.value('Such a fox !');

    const o = instance();
    expect(o.hex.baz()).toBe('bar');
    expect(o.fox).toBe('Such a fox !');
  });

  it('mocks instance with nested structure and some overwrites', () => {
    const mock = makeMock({
      hex: {
        bar: null,
        'baz()': 'What\'s the bazzz',
      },
    });

    mock.hex.bar.value('The bar');
    expect(instance().hex.bar).toBe('The bar');
    expect(instance().hex.baz()).toBe('What\'s the bazzz');

    mock.hex.bar.value('My bar');
    mock.hex.baz.returns('It\'s the beezzzzz');
    expect(instance().hex.bar).toBe('My bar');
    expect(instance().hex.baz()).toBe('It\'s the beezzzzz');
  });

  it('restores the mock', () => {
    class MyFoo {
      public bar: string = 'Orig bar';
    }
    const Module = { MyFoo };

    const mock = ClassMock(Module, { bar: 'Mocked bar' });
    mock.bar;

    expect(new Module.MyFoo().bar).toBe('Mocked bar');

    mock.$restore();
    expect(new Module.MyFoo().bar).toBe('Orig bar');
  });

  /*** Lib ***/

  function makeMock(spec = {}) {
    return ClassMock(ClassModule, spec, sinon);
  }
});

/*** Lib ***/

function instance(...args) {
  // @ts-ignore
  return new _TestClassMock(...args) as any;
}
