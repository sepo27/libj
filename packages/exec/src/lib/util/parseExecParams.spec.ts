import { parseExecParams } from './parseExecParams';
import { ExecParams, PartialStructExecParams, StructExecParams } from '../types';
import { DefaultStructExecParams } from './constants';

describe('parseExecParams()', () => {
  it('parses exec only', () => {
    assertRes(['pwd'], { exec: 'pwd' });
  });

  it('parses exec with command', () => {
    assertRes(['echo', 'foo'], { exec: 'echo', command: 'foo' });
  });

  it('parses exec with command & args', () => {
    assertRes(['docker', 'exec', ['ls']], {
      exec: 'docker',
      command: 'exec',
      commandOptsAndArgs: ['ls'],
    });
  });

  it('parses exec with command and zx opts', () => {
    assertRes(['docker', 'ps', { verbose: true }], {
      exec: 'docker',
      command: 'ps',
      zxOpts: { verbose: true },
    });
  });

  it('parses exec with command & opts and zx opts', () => {
    assertRes(['docker', 'ps', ['-a'], { verbose: true }], {
      exec: 'docker',
      command: 'ps',
      commandOptsAndArgs: ['-a'],
      zxOpts: { verbose: true },
    });
  });

  it('parses exec & opts', () => {
    assertRes(['docker', ['--help']], {
      exec: 'docker',
      execOpts: ['--help'],
    });
  });

  it('parses exec & opts and command', () => {
    assertRes(['docker', ['-c', 'foo'], 'ps'], {
      exec: 'docker',
      execOpts: ['-c', 'foo'],
      command: 'ps',
    });
  });

  it('parses exec & opts and command & args', () => {
    assertRes(['docker', ['-c', 'foo'], 'exec', ['-it', 'bar']], {
      exec: 'docker',
      execOpts: ['-c', 'foo'],
      command: 'exec',
      commandOptsAndArgs: ['-it', 'bar'],
    });
  });

  it('parses exec & opts and zx opts', () => {
    assertRes(['docker', ['-D'], { verbose: true }], {
      exec: 'docker',
      execOpts: ['-D'],
      zxOpts: { verbose: true },
    });
  });

  it('parses exec & opts and command and zx opts', () => {
    assertRes(['docker', ['-D'], 'ps', { verbose: true }], {
      exec: 'docker',
      execOpts: ['-D'],
      command: 'ps',
      zxOpts: { verbose: true },
    });
  });

  it('parses exec & opts and command & opts/args and zx opts', () => {
    assertRes(['docker', ['-D'], 'exec', ['-it', 'foo', 'ls'], { verbose: true }], {
      exec: 'docker',
      execOpts: ['-D'],
      command: 'exec',
      commandOptsAndArgs: ['-it', 'foo', 'ls'],
      zxOpts: { verbose: true },
    });
  });

  it('errors out for invalid params', () => {
    const invalidParams = [
      ['foo', 'bar', 'baz', 'abc'],
      [['abc'], 'bar'],
      [['abc'], 'bar', ['xyz']],
      [['abc'], 'bar', { aaa: 'bbb' }],
    ];

    invalidParams.forEach(params => {
      // @ts-ignore
      expect(() => parseExecParams(params)).toThrow(new Error('Invalid exec params given'));
    });
  });

  it('accepts struct exec params as is', () => {
    const params = {
      exec: 'docker',
      execOpts: ['-D'],
      command: 'exec',
      commandOptsAndArgs: ['-it', 'foo_run_123'],
      zxOpts: { verbose: true },
    };

    assertRes(params, params);
  });

  it('accepts struct exec params with exec only', () => {
    const params = {
      exec: 'pwd',
    };

    assertRes(params, params);
  });

  it('errors out when empty struct params object given', () => {
    // @ts-ignore
    expect(() => parseExecParams({})).toThrow(new Error('Missing at least <exec> in struct exec params'));
  });

  it('accepts tuple struct exec params as is', () => {
    const params = {
      exec: 'docker',
      execOpts: ['-D'],
      command: 'exec',
      commandOptsAndArgs: ['-it', 'foo_run_123'],
      zxOpts: { verbose: true },
    };

    assertRes([params], params);
  });

  it('accepts tuple struct exec params with exec only', () => {
    const params = {
      exec: 'pwd',
    };

    assertRes([params], params);
  });

  it('errors out when empty tuple struct params object given', () => {
    // @ts-ignore
    expect(() => parseExecParams([{}])).toThrow(new Error('Missing at least <exec> in struct exec params'));
  });

  /*** Util ***/

  function assertRes(params: ExecParams | PartialStructExecParams, expected: Partial<StructExecParams>) {
    expect(parseExecParams(params)).toEqual({ ...DefaultStructExecParams, ...expected });
  }
});
