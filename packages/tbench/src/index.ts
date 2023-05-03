import { ModuleMock } from './mock/module/ModuleMock';
import { ClassMock } from './mock/class/ClassMock';
import { CONSTRUCTOR_KEY, CONSTRUCTOR_ARGS_KEY, KEEP_ORIG_INSTANCE_KEY } from './mock/class/constants';

export {
  ModuleMock,
  ClassMock,

  /*** Constants ***/
  CONSTRUCTOR_KEY as CONSTRUCTOR,
  CONSTRUCTOR_ARGS_KEY as CONSTRUCTOR_ARGS,
  KEEP_ORIG_INSTANCE_KEY as KEEP_ORIG_INSTANCE,
};
