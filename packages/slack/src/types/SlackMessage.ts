import { LooseObject } from '../../../../common/types';

export interface SlackMessage {
  text: string
  blocks?: LooseObject[] // TODO: proper type
}
