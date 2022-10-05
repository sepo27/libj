import * as sinonLib from 'sinon';
import { ClassMock } from '../../tbench/src/mock/class/ClassMock';
import * as HttpClientModule from '../../http/src/client/HttpClient';
import { SlackWebhook } from './SlackWebhook';

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

  it('send() resolves', () => expect(new SlackWebhook('foo.bar').send({})).resolves.toBeUndefined());
});
