import {Action, createAction} from '@uxland/redux';
import {store} from '../../store';
import {SET_APP_INITIALIZED} from './reducer';

const setAppInitializedCreator = createAction<boolean>(SET_APP_INITIALIZED);
export const setAppInitialized: (initialized: boolean) => Action = (initialized: boolean) =>
  store.dispatch(setAppInitializedCreator(initialized));
