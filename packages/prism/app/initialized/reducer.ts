import {createBasicReducer} from '@uxland/redux';
import {Reducer} from 'redux';
import {actionsBuilder} from '../../constants';

export const SET_APP_INITIALIZED = actionsBuilder('set-app-initialized');
export const reducer: Reducer<boolean> = createBasicReducer<boolean>(SET_APP_INITIALIZED, {
  defValue: false,
});
