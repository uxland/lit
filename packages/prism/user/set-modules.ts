import {Action} from '@uxland/redux';
import {store} from '../store';
import {setModulesAction} from './actions';
import {ModuleInfo} from './reducer';
export const setModules: (modules: ModuleInfo[]) => Action = (modules: ModuleInfo[]) =>
  store.dispatch(setModulesAction(modules));
