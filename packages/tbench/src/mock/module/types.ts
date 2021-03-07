import { LooseObject } from '../../../../../common/types';

export interface ModuleMockT extends LooseObject {}

export interface ModuleMockMap {
  [key: string]: ModuleMockT,
}

export type ModuleMockFactory = (params: { mock: ModuleMockMap }) => ModuleMockT; // eslint-disable-line no-unused-vars
