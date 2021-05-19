import {createAction, createActionThunk} from '@uxland/redux';
import {FETCH_USER_ACTION, LOGIN_USER_ACTION, ModuleInfo, SET_MODULES} from './reducer';

export const fetchUserAction: (action: () => any) => any = action =>
  createActionThunk(FETCH_USER_ACTION, action);
export const loginUserAction: <T>(
  action: (username: string, password: string) => Promise<T>
) => any = action => createActionThunk(LOGIN_USER_ACTION, action);
export const setModulesAction = createAction<ModuleInfo[]>(SET_MODULES);
