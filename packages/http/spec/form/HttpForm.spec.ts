import { HttpClientTBench } from '../bench/HttpClientTBench';
import { HttpForm } from '../../src/form/HttpForm';
import { HttpConfigError } from '../../src/error/HttpConfigError';

describe('HttpForm', () => {
  let bench: HttpClientTBench;

  beforeEach(() => {
    bench = new HttpClientTBench();
  });

  afterEach(() => {
    bench.restore();
  });

  it('appendFile() down-streams append() with file stream', () => {
    const
      field = 'file',
      filename = 'foo.json',
      stream = 'test_stream';

    bench.mock.fs.existsSync.withArgs(filename).returns(true);
    bench.mock.fs.createReadStream.withArgs(filename).returns(stream);
    const mock = bench.mock.formData.append;

    form().appendFile(field, filename);

    expect(mock.calledOnce).toBeTruthy();
    expect(mock.getCall(0).args).toEqual([field, stream]);
  });

  it('errors out for invalid filename', () => {
    const filename = 'dummy.file';

    bench.mock.fs.existsSync.withArgs(filename).returns(false);

    expect(() => form().appendFile('foo', filename)).toThrow(
      new HttpConfigError(`Invalid file to append: ${filename}`),
    );
  });
});

/*** Lib ***/

function form() {
  return new HttpForm();
}
