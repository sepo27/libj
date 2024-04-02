import * as sinonModule from 'sinon';
import { TMock } from './TMock';

describe('TMock', () => {
  let sinon: sinonModule.SinonSandbox;

  beforeEach(() => {
    sinon = sinonModule.createSandbox();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('provides ability to cache custom mocks', () => {
    const expectedMock = { dummy: 'mock' };
    const mockFactorySpy = sinon.stub().returns(expectedMock);

    class FooMock extends TMock {
      bar() { return this.makeMock('bar', mockFactorySpy); }
    }

    const fooMock = new FooMock();
    const actualMock = fooMock.bar();
    fooMock.bar();

    expect(mockFactorySpy.callCount).toBe(1);
    expect(actualMock).toBe(expectedMock);
  });
});
