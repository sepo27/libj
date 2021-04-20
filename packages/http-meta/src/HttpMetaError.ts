export class HttpMetaError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, HttpMetaError.prototype);

    this.name = HttpMetaError.name;
  }
}
