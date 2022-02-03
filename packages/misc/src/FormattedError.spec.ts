import * as SprintJsModule from 'sprintf-js';
import { ModuleMock } from '../../tbench/src';
import { FormattedError } from './FormattedError';

describe('FormattedError', () => {
  let sprintfMock;

  beforeEach(() => {
    sprintfMock = ModuleMock(SprintJsModule);
  });

  afterEach(() => {
    sprintfMock.$restore();
  });

  it('formats simple message', () => {
    const
      message = 'Foo Error',
      formattedMessage = 'Dummy message';

    const printMock = sprintfMock.sprintf.returns(formattedMessage);

    const e = new FormattedError(message);

    expect(printMock.calledOnce).toBeTruthy();
    expect(printMock.getCall(0).args).toEqual([message]);
    expect(e.message).toBe(formattedMessage);
  });

  it('formats message with args', () => {
    const
      format = 'Some error: %s',
      args = ['message'],
      formattedMessage = 'Dummy message';

    const printMock = sprintfMock.sprintf.returns(formattedMessage);

    const e = new FormattedError(format, ...args);

    expect(printMock.calledOnce).toBeTruthy();
    expect(printMock.getCall(0).args).toEqual([format, ...args]);
    expect(e.message).toBe(formattedMessage);
  });
});
