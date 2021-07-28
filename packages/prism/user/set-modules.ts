import {Action} from '@uxland/redux';
import {store} from '../store';
import {setModulesAction} from './actions';
import {ModuleInfo} from './reducer';
export const setModules: (modules: ModuleInfo[], refresh?: boolean) => Action = (
  modules: ModuleInfo[],
  refresh = false
) => store.dispatch(setModulesAction(refresh != undefined ? {modules, refresh} : modules));
