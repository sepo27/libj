import * as fs from 'fs-extra';
import { FormData } from '../../lib/FormData';
import { HttpConfigError } from '../error/HttpConfigError';

export class HttpForm extends FormData {
  public appendFile(field: string, filename: string) {
    if (!fs.existsSync(filename)) {
      throw new HttpConfigError(`Invalid file to append: ${filename}`);
    }

    const stream = fs.createReadStream(filename);

    this.append(field, stream);
  }
}
