import {Action, createAction} from '@uxland/redux';
import {store} from '../store';
import {MainViewType, SET_VIEW_ACTION} from './reducer';

const setViewActionCreator = createAction<MainViewType>(SET_VIEW_ACTION);
export const setView: (view: MainViewType) => Action<MainViewType> = (view: MainViewType) =>
  store.dispatch(setViewActionCreator(view));
