import {publish} from '@uxland/event-aggregator';
import {Action, createAction} from '@uxland/redux';
import {Dispatch} from 'redux';
import {eventsBuilder} from '../../constants';
import {SET_APP_ONLINE_ACTION} from './reducer';

let offlineHandler: any;
let onlineHandler: any;

export const ONLINE_EVENT = eventsBuilder('online');
export const OFFLINE_EVENT = eventsBuilder('offline');

const setOnlineActionCreator = createAction(SET_APP_ONLINE_ACTION);
const setOfflineActionCreator = createAction(SET_APP_ONLINE_ACTION);
const setOnline = (online: boolean, dispatch: Dispatch<Action>) => {
  dispatch(online ? setOnlineActionCreator() : setOfflineActionCreator());
  publish(online ? ONLINE_EVENT : OFFLINE_EVENT);
};

export const init = (dispatch: Dispatch<Action>) => {
  if (offlineHandler) window.removeEventListener('offline', offlineHandler);
  if (onlineHandler) window.removeEventListener('online', onlineHandler);
  onlineHandler = () => setOnline(true, dispatch);
  offlineHandler = () => setOnline(false, dispatch);
  window.addEventListener('offline', offlineHandler);
  window.addEventListener('online', onlineHandler);
  if (window.navigator.onLine) setOnline(true, dispatch);
};
