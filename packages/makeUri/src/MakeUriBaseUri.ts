import { UriPart as Part } from './UriPart';
import { MakeUriError } from './MakeUriError';

const Regex = {
  Scheme: new RegExp(`^[\\w+-.]+${Part.COLON}`),
  Authority: /^[^/?#\s]+(?:[/?#]|[^:\s]$)/,
  Path: /(?:^|[^/])\/(?:[^/]|$)/,
};

const InvalidParts = [
  Part.SLASH,
  Part.QM,
  Part.HASH,
].map(p => `${Part.DSLASH}${p}`);

export class MakeUriBaseUri {
  constructor(value: string) {
    this.value = value.trim();
    this.validate();
  }

  /*** Public ***/

  public get hasScheme(): boolean { return Regex.Scheme.test(this.value); }

  public get schemeOnly(): boolean {
    return new RegExp(`${Regex.Scheme.source}$`).test(this.value);
  }

  public get hasAuthority(): boolean { return Regex.Authority.test(this.value); }

  public get hasNoAuthority(): boolean { return !this.hasAuthority; }

  public get hasPath(): boolean { return Regex.Path.test(this.value); }

  public get hasQuery(): boolean { return this.value.indexOf(Part.QM) > -1; }

  public get hasFragment(): boolean { return this.value.indexOf(Part.HASH) > -1; }

  public get empty(): boolean { return !this.value; }

  public get notEmpty(): boolean { return !this.empty; }

  public toString() { return this.value; }

  /*** Private ***/

  private value: string;

  private validate() {
    const err = new MakeUriError(`Invalid base uri given: ${this.value}`);

    if (InvalidParts.find(p => this.value.indexOf(p) > -1)) {
      throw err;
    }
  }
}
