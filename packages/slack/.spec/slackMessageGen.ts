import { SlackMessage } from '../src/types/SlackMessage';

export const slackMessageGen = (message: Partial<SlackMessage> = {}): SlackMessage => ({
  text: 'Foo',
  ...message,
});
