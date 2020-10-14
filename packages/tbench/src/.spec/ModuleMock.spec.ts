import * as fs from 'fs';
import { ModuleMock } from '../ModuleMock';
import { _barModuleMock, _fooModuleMock } from './.func';
import * as FuncModule from './.func';
import { _foxModuleMock } from './.func2';
import { _FooObjModuleMock } from './.obj';

describe('ModuleMock', () => {
  it('mocks node module directly', () => {
    const mock = ModuleMock('fs');
    mock.readFileSync.returns('Dummy file');

    expect(fs.readFileSync('')).toBe('Dummy file');
  });

  it('restores node module mock', () => {
    const mock = ModuleMock('fs');

    mock.mkdirSync.returns('Foo');
    expect(fs.mkdirSync('')).toBe('Foo');

    mock.$restore();
    expect(() => fs.mkdirSync('')).toThrow('ENOENT: no such file or directory, mkdir');
  });

  it('overwrites node module mock several times', () => {
    const mock = ModuleMock('fs');

    mock.existsSync.returns('bar');
    expect(fs.existsSync('')).toBe('bar');

    mock.existsSync.returns('foxy');
    expect(fs.existsSync('')).toBe('foxy');
  });

  it('mocks node module indirectly', () => {
    const mock = ModuleMock('fs');
    mock.readlinkSync.returns('my link');

    expect(_fooModuleMock()).toBe('my link');
  });

  it('mocks node module indirectly with destructuring', () => {
    const mock = ModuleMock('child_process');
    mock.spawn.returns('The Spawn');

    expect(_barModuleMock()).toBe('The Spawn');
  });

  it('mocks custom module', () => {
    const mock = ModuleMock(FuncModule);
    mock._barModuleMock.returns('Bar is Bar');

    expect(_foxModuleMock()).toBe('Bar is Bar');
  });
});
