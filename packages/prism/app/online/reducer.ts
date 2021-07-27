import {Action} from '@uxland/redux';
import {actionsBuilder} from '../../constants';

export const SET_APP_ONLINE_ACTION = actionsBuilder('SET-APP-ONLINE');
export const SET_APP_OFFLINE_ACTION = actionsBuilder('SET-APP-OFFLINE');
export const reducer = (state = false, action: Action) =>
  action.type === SET_APP_OFFLINE_ACTION
    ? true
    : action.type === SET_APP_OFFLINE_ACTION
    ? false
    : state;
