/* eslint-disable max-classes-per-file */

import * as sinonLib from 'sinon';
import { BaseLogger } from './BaseLogger';
import { LoggerLevel } from '../LoggerLevel';

describe('BaseLogger', () => {
  let sinon: sinonLib.SinonSandbox;

  beforeEach(() => {
    sinon = sinonLib.createSandbox();
  });

  afterEach(() => { sinon.reset(); });

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

  it('tolerates % symbols in message', () => {
    class DummyLogger extends BaseLogger {
      foo(...args: any[]): string { // @ts-ignore
        return this.format(...args);
      }
    }

    const logger = new DummyLogger();

    expect(logger.foo('Bar %foo')).toBe('Bar %foo');
  });

  it('escapes % symbols in params', () => {
    class DummyLogger extends BaseLogger {
      foo(...args: any[]): string { // @ts-ignore
        return this.format(...args);
      }
    }

    const logger = new DummyLogger();

    expect(logger.foo('Foo %s', '%bar')).toBe('Foo %bar');
  });

  it('supports timestamp option with all defaults', () => {
    class DummyLogger extends BaseLogger {
      foo(...args: any[]): string { // @ts-ignore
        return this.format(...args);
      }
    }

    const now = new Date('2011-10-05T14:48:00.000Z');
    sinon.useFakeTimers(now);

    const logger = new DummyLogger({ timestamp: true });

    expect(logger.foo('Foo bar')).toBe(`[${now.toISOString()}] Foo bar`);
  });

  it('supports timestamp option with custom placeholder but default date', () => {
    class DummyLogger extends BaseLogger {
      foo(...args: any[]): string { // @ts-ignore
        return this.format(...args);
      }
    }

    const now = new Date('2011-10-05T14:48:00.000Z');
    sinon.useFakeTimers(now);

    const logger = new DummyLogger({ timestamp: true });

    expect(logger.foo('{%a} Foo bar baz')).toBe(`{${now.toISOString()}} Foo bar baz`);
  });

  it('supports timestamp options with multiple placeholders and default date', () => {
    class DummyLogger extends BaseLogger {
      foo(...args: any[]): string { // @ts-ignore
        return this.format(...args);
      }
    }

    const now = new Date('2011-10-05T14:48:00.000Z');
    sinon.useFakeTimers(now);

    const logger = new DummyLogger({ timestamp: true });

    expect(logger.foo('{%a} Foo bar {%a}')).toBe(`{${now.toISOString()}} Foo bar {${now.toISOString()}}`);
  });

  it('supports timestamp option with default placeholder and custom date', () => {
    class DummyLogger extends BaseLogger {
      foo(...args: any[]): string { // @ts-ignore
        return this.format(...args);
      }
    }

    const now = new Date('2011-10-05T14:48:00.000Z');

    const logger = new DummyLogger({ timestamp: () => now.toISOString() });

    expect(logger.foo('The message')).toBe(`[${now.toISOString()}] The message`);
  });

  it('supports timestamp option with custom placeholders and custom date', () => {
    class DummyLogger extends BaseLogger {
      foo(...args: any[]): string { // @ts-ignore
        return this.format(...args);
      }
    }

    const now = new Date('2011-10-05T14:48:00.000Z');

    const logger = new DummyLogger({ timestamp: () => now.toISOString() });

    expect(logger.foo('(%a) A message (%a)')).toBe(`(${now.toISOString()}) A message (${now.toISOString()})`);
  });
});
