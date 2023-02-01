import { HttpClient } from '../../http/src/client/HttpClient';
import { SlackMessage } from './types/SlackMessage';
import { SlackMessageBlockType } from './constants/SlackMessageBlockType';
import { SLACK_MAX_TEXT_LENGTH } from './constants';
import { HttpResponse } from '../../http/src/client/types';

/**
 * Adding buffer of ten chars.
 */
const MAX_TEXT_LENGTH = SLACK_MAX_TEXT_LENGTH - 10;

export class SlackWebhook {
  constructor(hookUrl: string) {
    this.http = new HttpClient({
      baseURL: hookUrl,
    });
  }

  public send(message: SlackMessage): Promise<HttpResponse> {
    return this.http.post('', this.trimLongMessageTexts(message));
  }

  private http: HttpClient;

  /**
   * Only works for section blocks currently.
   */
  private trimLongMessageTexts(message) {
    if (message.blocks && message.blocks.length) {
      return {
        ...message,
        blocks: message.blocks.reduce(
          (acc, block) => {
            if (
              block.type === SlackMessageBlockType.SECTION
              && block.text
              && block.text.text
              && block.text.text.length > MAX_TEXT_LENGTH
            ) {
              // eslint-disable-next-line no-param-reassign, prefer-template
              block.text.text = block.text.text.substring(0, MAX_TEXT_LENGTH - 4) + '\n...';
            }
            return acc.concat(block);
          },
          [],
        ),
      };
    }

    return message;
  }
}
