import { ModuleMock } from '../../tbench/src/ModuleMock';
import { execFileSync } from './execFileSync';

describe('execFileSync()', () => {
  let mock, spy;

  beforeEach(() => {
    mock = ModuleMock('child_process');
    spy = mock.execFileSync.returns('Dummy');
  });

  afterEach(() => {
    mock.$restore();
  });

  it('calls the file', () => {
    execFileSync('echo');
    expect(spy.calledOnceWith('echo')).toBeTruthy();
  });

  it('calls with args', () => {
    execFileSync('echo', ['foo']);
    expect(spy.calledOnceWith('echo', ['foo'])).toBeTruthy();
  });

  it('returns string output', () => {
    spy.withArgs('bar').returns(Buffer.from('Bazzzz'));

    expect(execFileSync('bar')).toBe('Bazzzz');
  });

  it('throws meaningful Error', () => {
    const err = new Error('Command foxy failed');
    // @ts-ignore
    err.stdout = Buffer.from('The temp was cold');

    spy.withArgs('foxy').throws(err);

    const expectedMsg = 'Command foxy failed\nThe temp was cold';

    expect(() => execFileSync('foxy')).toThrowError(new Error(expectedMsg));
  });
});
