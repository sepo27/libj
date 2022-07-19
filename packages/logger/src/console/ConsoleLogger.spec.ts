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
      expect(mock.getCall(0).args).toEqual([`${level}: Hello World`]);
    });
  });

  it('printSameLn() calls process stdout write with line ending', () => {
    // @ts-ignore
    process.stdout.clearLine = () => {}; // TODO: figure out why clearLine does not exist when trying to mock by sinon

    const
      clearLineMock = sinon.stub(process.stdout, 'clearLine'),
      writeMock = sinon.stub(process.stdout, 'write');

    new ConsoleLogger().printSameLn('Foo');

    expect(writeMock.calledOnce).toBeTruthy();
    expect(writeMock.getCall(0).args).toEqual(['Foo\r']);

    expect(clearLineMock.calledOnce).toBeTruthy();
    expect(clearLineMock.getCall(0).args).toEqual([0]);

    sinon.assert.callOrder(clearLineMock, writeMock);
  });

  it('printSameLn() prints with args', () => {
    const writeMock = sinon.stub(process.stdout, 'write');

    new ConsoleLogger().printSameLn('Happy %s', 'Nation');

    expect(writeMock.calledOnce).toBeTruthy();
    expect(writeMock.getCall(0).args).toEqual(['Happy Nation\r']);
  });
});
