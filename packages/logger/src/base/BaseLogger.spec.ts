/* eslint-disable max-classes-per-file */

import { BaseLogger } from './BaseLogger';
import { LoggerLevel } from '../LoggerLevel';

describe('BaseLogger', () => {
  it('formats message', () => {
    class DummyLogger extends BaseLogger {
      foo() { return this.format('Foo Bar'); }
    }

    expect(new DummyLogger().foo()).toBe('Foo Bar');
  });

  it('formats message with args', () => {
    class DummyLogger extends BaseLogger {
      foo() { return this.format('Foo %s', ['bar']); }
    }

    expect(new DummyLogger().foo()).toBe('Foo bar');
  });

  it('formats message with level', () => {
    class DummyLogger extends BaseLogger {
      foo() { return this.format(LoggerLevel.WARN, 'Foo %s', ['bar']); }
    }

    expect(new DummyLogger().foo()).toBe(`${LoggerLevel.WARN}: Foo bar`);
  });

  it('utilizes global prefix', () => {
    class DummyLogger extends BaseLogger {
      foo(...args) { // @ts-ignore
        return this.format(...args);
      }
    }

    const logger = new DummyLogger({
      prefix: 'Dummy',
    });

    expect(logger.foo('Test me test')).toBe('[Dummy]: Test me test');
  });

  it('formats message with level, args and global prefix', () => {
    class DummyLogger extends BaseLogger {
      foo(...args) { // @ts-ignore
        return this.format(...args);
      }
    }

    const logger = new DummyLogger({
      prefix: 'Bar',
    });

    expect(logger.foo(LoggerLevel.INFO, 'Baz %s', 'Foxy')).toBe(`[Bar] ${LoggerLevel.INFO}: Baz Foxy`);
  });

  it('provides options setter', () => {
    class DummyLogger extends BaseLogger {
      foo(...args) { // @ts-ignore
        return this.format(...args);
      }
    }

    const logger = new DummyLogger();
    logger.setOptions({
      prefix: 'Fooo',
    });

    expect(logger.foo('Hello World')).toBe('[Fooo]: Hello World');
  });
});
