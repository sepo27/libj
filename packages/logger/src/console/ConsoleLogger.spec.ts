import * as sinonLib from 'sinon';
import { ConsoleLogger } from './ConsoleLogger';
import { BaseLogger } from '../base/BaseLogger';
import { LoggerLevel } from '../LoggerLevel';

describe('ConsoleLogger', () => {
  let sinon: sinonLib.SinonSandbox;
  // let bench: TBench;

  beforeEach(() => {
    sinon = sinonLib.createSandbox();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('extends BaseLogger', () => {
    expect(new ConsoleLogger()).toBeInstanceOf(BaseLogger);
  });

  it('downstreams to corresponding console level with format', () => {
    Object.values(LoggerLevel).forEach(level => {
      const mock = sinon.stub(console, level);

      new ConsoleLogger()[level]('Hello %s', 'World');

      expect(mock.calledOnce).toBeTruthy();
      expect(mock.getCall(0).args).toEqual([`${level}: Hello World\n`]);
    });
  });
});
