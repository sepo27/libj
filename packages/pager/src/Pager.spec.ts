import * as sinonLib from 'sinon';
import { Pager } from './Pager';

describe('Pager', () => {
  let sinon: sinonLib.SinonSandbox;

  beforeEach(() => {
    sinon = sinonLib.createSandbox();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('retrieves next when per page is bigger', () => {
    const
      request = makeRequest(3),
      pager = new Pager(request, { perPage: 5 });

    return expect(pager.next()).resolves.toEqual([1, 2, 3]);
  });

  it('retrieves next one by one', async () => {
    const
      DATA_LENGTH = 6,
      PER_PAGE = 2,
      request = makeRequest(DATA_LENGTH),
      pager = new Pager(request, { perPage: PER_PAGE }),
      maxRows = Math.ceil(DATA_LENGTH / PER_PAGE);

    for (let row = 0; row < maxRows; row++) {
      const
        shiftIdx = row * PER_PAGE,
        expected = Array(PER_PAGE).fill(null).map((_, i) => shiftIdx + i + 1);

      // eslint-disable-next-line no-await-in-loop
      const next = await pager.next();

      expect(next).toEqual(expected);
    }

    const next = await pager.next();

    expect(next).toHaveLength(0);
  });

  it('exposes hasNext() api', async () => {
    const
      request = makeRequest(5),
      pager = new Pager(request, { perPage: 2 });

    const res = [];

    while (pager.undone()) {
      // eslint-disable-next-line no-await-in-loop
      res.push(await pager.next());
    }

    expect(res).toEqual([[1, 2], [3, 4], [5], []]);
  });

  it('prevents redundant requests', async () => {
    const
      request = makeRequest(3),
      pager = new Pager(request, { perPage: 3 });

    await pager.next();
    await pager.next();
    await pager.next();

    expect(request.callCount).toBe(2);
  });

  it('retrieves all for one page', () => {
    const
      request = makeRequest(3),
      pager = new Pager(request);

    return expect(pager.all()).resolves.toEqual([1, 2, 3]);
  });

  it('retrieves all for several pages', async () => {
    const
      request = makeRequest(4),
      pager = new Pager(request, { perPage: 2 }),
      res = await pager.all();

    expect(res).toEqual([1, 2, 3, 4]);
  });

  /*** Lib ***/

  function makeRequest(dataLength) {
    const data = Array(dataLength)
      .fill(null)
      .map((_, i) => i + 1);

    return sinon.spy((page, perPage) => new Promise<number[]>(resolve => {
      const
        pageIdx = Math.max(page - 1, 0),
        shiftIdx = pageIdx * perPage,
        set = data.slice(pageIdx * perPage, shiftIdx + perPage);

      resolve(set);
    }));
  }
});
