import { PagerOptions, PagerRequest } from './types';

const DefaultOptions: PagerOptions = {
  perPage: 25,
  initialPage: 1,
};

export class Pager<T = any> {
  constructor( // eslint-disable-line no-useless-constructor
    private request: PagerRequest<T>,
    options: PagerOptions = DefaultOptions,
  ) {
    this.options = { ...DefaultOptions, ...options };
    this.page = this.options.initialPage;
  }

  /*** Public ***/

  public next(): Promise<T[]> {
    if (this.ended) {
      return Promise.resolve([]);
    }

    return this
      .request(this.page, this.options.perPage)
      .then(set => {
        if (set.length) {
          this.page++;
        } else {
          this.ended = true;
        }
        return set;
      });
  }

  public undone(): boolean { return !this.ended; }

  public all(): Promise<T[]> {
    let res = [];

    const next = () => this.next().then(set => {
      if (this.ended) {
        return res;
      }
      res = res.concat(set);
      return next();
    });

    return next();
  }

  /*** Private ***/

  private options: PagerOptions;
  private page: number;
  private ended: boolean = false;
}
