import { HttpClient } from '../../http/src/client/HttpClient';
import { LooseObject } from '../../../common/types';

export class SlackWebhook {
  constructor(hookUrl: string) {
    this.http = new HttpClient({
      baseURL: hookUrl,
    });
  }

  public send(message: LooseObject) {
    return this.http.post('', message);
  }

  private http: HttpClient;
}
