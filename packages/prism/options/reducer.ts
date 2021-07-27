import {createBasicReducer} from '@uxland/redux';
import {Reducer} from 'redux';
import {actionsBuilder} from '../constants';

export const SET_OPTIONS_ACTION = actionsBuilder('SET-OPTIONS');
export interface OptionsState {
  modulesBaseRootPath: string;
  appsBaseRoute?: string;
  apiUrl: string;
}
export const reducer: Reducer<OptionsState> = createBasicReducer<OptionsState>(SET_OPTIONS_ACTION, {
  defValue: null,
});
