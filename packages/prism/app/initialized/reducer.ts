import {createBasicReducer} from '@uxland/redux/create-basic-reducer';
import {Reducer} from 'redux';
import {actionsBuilder} from '../../constants';

export const SET_APP_INITIALIZED = actionsBuilder('SET-APP-INITIALIZED');
export const reducer: Reducer<boolean> = createBasicReducer<boolean>(SET_APP_INITIALIZED, {
  defValue: false,
});
