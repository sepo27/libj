import { ExecTBench } from '../../../../@spec/bench/ExecTBench';
import { ansiblePlaybookExec } from './ansiblePlaybookExec';

describe('ansiblePlaybookExec()', () => {
  let bench: ExecTBench;

  beforeEach(() => {
    bench = new ExecTBench();
    bench.mock.zxec;
  });

  afterEach(() => {
    bench.restore();
  });

  it('runs with single playbook only', () => {
    ansiblePlaybookExec('foo');
    bench.assert.zxecCall('ansible-playbook', ['foo']);
  });

  it('runs with multiple playbooks', () => {
    ansiblePlaybookExec('foo', 'bar');
    bench.assert.zxecCall('ansible-playbook', ['foo', 'bar']);
  });

  it('runs with multiple playbooks and opts', () => {
    ansiblePlaybookExec('foo', 'bar', ['-a', '-b']);
    bench.assert.zxecCall('ansible-playbook', ['foo', 'bar', '-a', '-b']);
  });

  it('runs with multiple playbooks and zx opts', () => {
    ansiblePlaybookExec('baz', 'fox', { verbose: true });
    bench.assert.zxecCall('ansible-playbook', ['baz', 'fox'], { verbose: true });
  });

  it('runs with multiple playbooks, opts and zx opts', () => {
    ansiblePlaybookExec('baz', 'fox', ['-c', '-d'], { verbose: true });
    bench.assert.zxecCall('ansible-playbook', ['baz', 'fox', '-c', '-d'], { verbose: true });
  });

  it('resolves with zexc response', () => {
    const res = { foo: 'bar' };
    bench.mock.zxec.resolves(res);

    return expect(ansiblePlaybookExec('baz')).resolves.toBe(res);
  });
});
