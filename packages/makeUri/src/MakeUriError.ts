export class MakeUriError extends Error {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MakeUriError.prototype);
  }
}
