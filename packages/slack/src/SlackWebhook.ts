import { HttpClient } from '../../http/src/client/HttpClient';
import { SlackMessage } from './types/SlackMessage';
import { SlackMessageBlockType } from './constants/SlackMessageBlockType';
import { SLACK_MAX_TEXT_LENGTH } from './constants';
import { HttpResponse } from '../../http/src/client/types';

/**
 * Adding buffer of ten chars.
 */
const MAX_TEXT_LENGTH = SLACK_MAX_TEXT_LENGTH - 10;

interface Options {
  extraHooks?: {
    [key: string]: string
  }
}

interface SendOptions {
  hook?: string,
}

export class SlackWebhook {
  constructor(defaultHook: string, opts: Options = {}) {
    this.http = new HttpClient({});
    this.defaultHook = defaultHook;
    this.opts = opts;
  }

  /*** Public ***/

  public send(message: SlackMessage, opts: SendOptions = {}): Promise<HttpResponse> {
    const hookUrl = opts.hook ? this.getExtraHookUrl(opts.hook) : this.defaultHook;
    return this.http.post(hookUrl, this.trimLongMessageTexts(message));
  }

  private readonly http: HttpClient;
  private readonly defaultHook: string;
  private readonly opts: Options = {};

  /*** Private ***/

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

  private getExtraHookUrl(hook) {
    if (this.opts?.extraHooks?.[hook]) {
      return this.opts.extraHooks[hook];
    }
    throw new Error(`Extra hook '${hook}' is not defined`);
  }
}
