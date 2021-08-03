import {subscribe} from '@uxland/event-aggregator';
import {
  FORMATTERS_RESET,
  FORMATTERS_UPDATED,
  LANGUAGE_RESET,
  LANGUAGE_UPDATED,
  LOCALES_RESET,
  LOCALES_UPDATED,
} from '@uxland/localization';
import {actionNameBuilder} from '@uxland/redux/action-name-builder';
import {Action, createAction} from '@uxland/redux/create-action';
import {createBasicReducer} from '@uxland/redux/create-basic-reducer';
import {combineReducers, Reducer} from 'redux';
import {store} from '../store';

export interface LocalizationState {
  formats: Record<string, any>;
  locales: Record<string, any>;
  language: string;
}

const prefix = 'UXL-LOCALIZATION';

export const locActionNamesFactory = (action: string) => {
  const actionsBuilder = actionNameBuilder(prefix);
  return actionsBuilder(action);
};

const setFormattersActionName = locActionNamesFactory('SET-FORMATS');
export const formatReducer: (state: any, action: Action<any, any>) => any =
  createBasicReducer(setFormattersActionName);
export const setFormattersActionCreator = createAction<any, any>(setFormattersActionName);

const setLanguageActionName = locActionNamesFactory('SET-LANGUAGE');
export const languageReducer: (state: any, action: Action<any, any>) => any =
  createBasicReducer(setLanguageActionName);
export const setLanguageActionCreator = createAction<any, any>(setLanguageActionName);

const setLocalesActionName = locActionNamesFactory('SET-LOCALES');
export const localesReducer: (state: any, action: Action<any, any>) => any =
  createBasicReducer(setLocalesActionName);
export const setLocalesActionCreator = createAction<any, any>(setLocalesActionName);

export const reducer: Reducer = combineReducers<LocalizationState>({
  formats: formatReducer,
  language: languageReducer,
  locales: localesReducer,
});

subscribe(LANGUAGE_UPDATED, language => store.dispatch(setLanguageActionCreator(language)));
subscribe(LANGUAGE_RESET, language => store.dispatch(setLanguageActionCreator(language)));
subscribe(FORMATTERS_UPDATED, formats => store.dispatch(setFormattersActionCreator(formats)));
subscribe(FORMATTERS_RESET, formats => store.dispatch(setFormattersActionCreator(formats)));
subscribe(LOCALES_UPDATED, locales => store.dispatch(setLocalesActionCreator(locales)));
subscribe(LOCALES_RESET, locales => store.dispatch(setLocalesActionCreator(locales)));
