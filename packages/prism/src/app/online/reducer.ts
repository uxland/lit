import {Action} from '@uxland/redux';
import {actionsBuilder} from '../../constants';

export const SET_APP_ONLINE_ACTION = actionsBuilder('set-app-online');
export const SET_APP_OFFLINE_ACTION = actionsBuilder('set-app-offline');
export const reducer = (state = false, action: Action) =>
  action.type === SET_APP_OFFLINE_ACTION
    ? true
    : action.type === SET_APP_OFFLINE_ACTION
    ? false
    : state;
