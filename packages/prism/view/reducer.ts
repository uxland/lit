import {createBasicReducer} from '@uxland/redux';
import {Reducer} from 'redux';
import {actionsBuilder} from '../constants';

export type MainViewType = 'splash' | 'login' | 'shell';
export const SET_VIEW_ACTION = actionsBuilder('SET-VIEW-ACTION');
export const reducer: Reducer<MainViewType> = createBasicReducer<MainViewType>(SET_VIEW_ACTION, {
  defValue: 'splash',
});
