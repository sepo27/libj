import { HttpClientTMock } from './HttpClientTMock';
import { HttpClientTAssert } from './HttpClientTAssert';

export class HttpClientTBench {
  constructor() {
    this.mock = new HttpClientTMock();
    this.assert = new HttpClientTAssert(this.mock);
  }

  public readonly mock: HttpClientTMock;
  public readonly assert: HttpClientTAssert;

  public restore() { this.mock.restore(); }
}
