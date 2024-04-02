import { parseDockerExecExecParams } from './parseDockerExecExecParams';
import { DockerExecExecParams, PartialStructDockerExecExecParams, StructDockerExecExecParams } from './types';
import { DefaultStructDockerExecExecParams } from './constants';

describe('parseDockerExecExecParams()', () => {
  it('parses container & single argument', () => {
    assertParse(['foo', 'ls'], {
      container: 'foo',
      containerArgs: ['ls'],
    });
  });

  it('parses container & multiple arguments', () => {
    assertParse(['foo', ['ls', '-al']], {
      container: 'foo',
      containerArgs: ['ls', '-al'],
    });
  });

  it('parses container & exec opts & single argument', () => {
    assertParse([['-it', 'foo'], 'ls'], {
      container: 'foo',
      containerArgs: ['ls'],
      execOpts: ['-it'],
    });
  });

  it('parses container & exec opts & multiple arguments', () => {
    assertParse([['-it', 'foo'], ['ls', '-al']], {
      container: 'foo',
      containerArgs: ['ls', '-al'],
      execOpts: ['-it'],
    });
  });

  it('parses container & single argument and docker opts', () => {
    assertParse([['-c', 'abc'], 'bar', 'ls'], {
      container: 'bar',
      containerArgs: ['ls'],
      dockerOpts: ['-c', 'abc'],
    });
  });

  it('parses container & multiple arguments and docker opts', () => {
    assertParse([['-c', 'abc'], 'bar', ['ls', '-al']], {
      container: 'bar',
      containerArgs: ['ls', '-al'],
      dockerOpts: ['-c', 'abc'],
    });
  });

  it('parses container & exec opts & single argument and docker opts', () => {
    assertParse([['-c', 'abc'], ['-it', 'foo'], 'ls'], {
      container: 'foo',
      containerArgs: ['ls'],
      execOpts: ['-it'],
      dockerOpts: ['-c', 'abc'],
    });
  });

  it('parses container & exec opts & multiple arguments and docker opts', () => {
    assertParse([['-c', 'abc'], ['-it', 'foo'], 'ls'], {
      container: 'foo',
      containerArgs: ['ls'],
      execOpts: ['-it'],
      dockerOpts: ['-c', 'abc'],
    });
  });

  it('parses container & single argument and zx opts', () => {
    assertParse(['foo', 'ls', { verbose: true }], {
      container: 'foo',
      containerArgs: ['ls'],
      zxOpts: { verbose: true },
    });
  });

  it('parses container & multiple arguments and zx opts', () => {
    assertParse(['foo', ['ls', '-al'], { verbose: true }], {
      container: 'foo',
      containerArgs: ['ls', '-al'],
      zxOpts: { verbose: true },
    });
  });

  it('parses container & exec opts & single argument and zx opts', () => {
    assertParse([['-it', 'foo'], 'ls', { verbose: true }], {
      container: 'foo',
      containerArgs: ['ls'],
      execOpts: ['-it'],
      zxOpts: { verbose: true },
    });
  });

  it('parses container & exec opts & multiple arguments and zx opts', () => {
    assertParse([['-it', 'foo'], ['ls', '-al'], { verbose: true }], {
      container: 'foo',
      containerArgs: ['ls', '-al'],
      execOpts: ['-it'],
      zxOpts: { verbose: true },
    });
  });

  it('parses container & exec opts & single argument and docker opts and zx opts', () => {
    assertParse([['-D'], ['-it', 'foo'], 'ls', { verbose: true }], {
      container: 'foo',
      containerArgs: ['ls'],
      execOpts: ['-it'],
      dockerOpts: ['-D'],
      zxOpts: { verbose: true },
    });
  });

  it('parses container & exec opts & multiple arguments and docker opts and zx opts', () => {
    assertParse([['-D'], ['-it', 'foo'], 'ls', { verbose: true }], {
      container: 'foo',
      containerArgs: ['ls'],
      execOpts: ['-it'],
      dockerOpts: ['-D'],
      zxOpts: { verbose: true },
    });
  });

  it('parses docker struct exec params', () => {
    const params = {
      container: 'foo_run_332211',
      containerArgs: ['ls', '-al'],
      execOpts: ['-it'],
      dockerOpts: ['-D'],
      zxOpts: { verbose: true },
    };

    assertParse(params as PartialStructDockerExecExecParams, params);
  });

  it('parses docker struct exec params tuple', () => {
    const params = {
      container: 'foo_run_332211',
      containerArgs: ['ls', '-al'],
      execOpts: ['-it'],
      dockerOpts: ['-D'],
      zxOpts: { verbose: true },
    };

    assertParse([params], params);
  });

  it('errors out when container and/or container args are missing', () => {
    const invalidParams = [
      {},
      { container: '' },
      { container: 'foo' },
      { container: 'foo', containerArgs: [] },
    ];

    invalidParams.forEach(params => {
      // @ts-ignore
      expect(() => parseDockerExecExecParams(params)).toThrow(new Error('Missing <container> and/or <containerArgs>'));
    });
  });

  it('erorrs out for invalid params', () => {
    const invalidParams = [
      ['foo', {}],
      ['foo', {}, {}],
      [{}, 'foo', 'bar'],
      [{}, 'foo', 'bar', {}],
    ];

    invalidParams.forEach(params => {
      // @ts-ignore
      expect(() => parseDockerExecExecParams(params)).toThrow(new Error('Invalid dockerExecExec params'));
    });
  });

  /*** Util ***/

  function assertParse(
    params: DockerExecExecParams | PartialStructDockerExecExecParams,
    expected: Partial<StructDockerExecExecParams>,
  ) {
    expect(parseDockerExecExecParams(params)).toEqual({ ...DefaultStructDockerExecExecParams, ...expected });
  }
});
