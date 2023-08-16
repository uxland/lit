import {publish} from '@uxland/event-aggregator';
import {createAction} from '@uxland/redux/create-action';
import {eventsBuilder} from './constants';
import {DISCONNECT_ACTION, resetReducers, store} from './store';

const disconnectActionCreator = createAction(DISCONNECT_ACTION);

export const LOGOUT_EVENT = eventsBuilder('log-out');
export const disconnect = () => {
  publish(LOGOUT_EVENT);
  resetReducers();
  store.dispatch(disconnectActionCreator());
};
