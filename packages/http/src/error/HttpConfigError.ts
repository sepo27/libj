export class HttpConfigError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, HttpConfigError.prototype);

    this.name = HttpConfigError.name;
  }
}
