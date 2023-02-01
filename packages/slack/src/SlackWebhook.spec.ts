import * as sinonLib from 'sinon';
import { ClassMock } from '../../tbench/src/mock/class/ClassMock';
import * as HttpClientModule from '../../http/src/client/HttpClient';
import { SlackWebhook } from './SlackWebhook';
import { slackMessageGen } from '../.spec/slackMessageGen';
import { slackTextGen } from '../.spec/slackTextGen';
import { SlackMessageBlockType } from './constants/SlackMessageBlockType';
import { SlackMessageTextType } from './constants/SlackMessageTextType';
import { SLACK_MAX_TEXT_LENGTH } from './constants';

describe('SlackWebhook', () => {
  let sinon: sinonLib.SinonSandbox, mock: any = {};

  beforeEach(() => {
    sinon = sinonLib.createSandbox();
    mock = {
      http: ClassMock(HttpClientModule, { 'post()': null }, sinon),
    };
    mock.http.post.resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('Instantiates http client', () => {
    const url = 'http://boo.bar';

    mock.http.$constructor;

    // eslint-disable-next-line no-new
    new SlackWebhook(url);

    expect(mock.http.$constructor.calledOnce).toBeTruthy();
    expect(mock.http.$constructor.getCall(0).args).toEqual([{
      baseURL: url,
    }]);
  });

  it('send() posts message to slack', () => {
    const message = { text: 'Foo Bar' };

    mock.http.post;

    new SlackWebhook('bar.foo').send(message);

    expect(mock.http.post.calledOnce).toBeTruthy();
    expect(mock.http.post.getCall(0).args).toEqual(['', message]);
  });

  it('send() trims long text blocks', () => {
    const
      inputText = slackTextGen({ length: 3100 }),
      message = slackMessageGen({
        blocks: [
          {
            type: SlackMessageBlockType.SECTION,
            text: {
              type: SlackMessageTextType.TEXT,
              text: inputText,
            },
          },
        ],
      });

    const expectedMessageText = inputText.substr(0, SLACK_MAX_TEXT_LENGTH - 10 - 4) + '\n...'; // eslint-disable-line prefer-template

    mock.http.post;

    new SlackWebhook('dummy').send(message);

    expect(mock.http.post.callCount).toBe(1);
    expect(mock.http.post.getCall(0).args[1].blocks[0].text.text).toBe(expectedMessageText);
  });

  it('send() resolves', () => expect(new SlackWebhook('foo.bar').send(slackMessageGen())).resolves.toBeUndefined());
});
