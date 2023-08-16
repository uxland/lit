import {createAction} from '@uxland/redux/create-action';
import {createActionThunk} from '@uxland/redux/create-action-thunk';
import {FETCH_USER_ACTION, LOGIN_USER_ACTION, ModuleInfo, SET_MODULES} from './reducer';

export const fetchUserAction: (action: () => any) => any = action =>
  createActionThunk(FETCH_USER_ACTION, action);
export const loginUserAction: <T>(
  action: (username: string, password: string) => Promise<T>
) => any = action => createActionThunk(LOGIN_USER_ACTION, action);
export const setModulesAction = createAction<
  ModuleInfo[] | {modules: ModuleInfo[]; refresh: boolean}
>(SET_MODULES);
