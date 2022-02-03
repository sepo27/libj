import { sprintf } from 'sprintf-js';

export class FormattedError extends Error {
  constructor(format, ...args) {
    super(sprintf(format, ...args));

    // Set the prototype explicitly
    Object.setPrototypeOf(this, FormattedError.prototype);
    this.name = FormattedError.name;
  }
}
