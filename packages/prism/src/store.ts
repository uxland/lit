import {LocalizationState, reducer as localization} from '@uxland/localization';
import {Action} from '@uxland/redux';
import {reducer as routing, RoutingState} from '@uxland/routing';
import {pickAll} from 'ramda';
import {applyMiddleware, combineReducers, compose, createStore, Reducer, Store} from 'redux';
import thunk from 'redux-thunk';
import {ApplicationState, reducer as app} from './app/reducer';
import {actionsBuilder} from './constants';
import {OptionsState, reducer as options} from './options/reducer';
import {reducer as user, UserState} from './user/reducer';
import {MainViewType, reducer as view} from './view/reducer';

export interface PrismAppState {
  app: ApplicationState;
  user: UserState<any>;
  localization: LocalizationState;
  routing: RoutingState;
  view: MainViewType;
  options: OptionsState;
}

export type ReducerDictionary = {[key: string]: Reducer};
let reducers: ReducerDictionary = {};
export const DISCONNECT_ACTION = actionsBuilder('disconnect');
const createReducer = (reducers: ReducerDictionary = {}) => {
  const mainReducer = combineReducers({
    ...{localization, routing, user, view, app, options},
    ...reducers,
  });
  return (state: PrismAppState, action: Action) =>
    mainReducer(
      action.type === DISCONNECT_ACTION
        ? <any>{
            app: state.app,
            localization: state.localization,
            options: state.options,
          }
        : state,
      action
    );
};
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store: Store<PrismAppState> = createStore(
  createReducer(),
  composeEnhancers(applyMiddleware(thunk))
);
export const disconnect = () => {
  store.replaceReducer(createReducer());
  store.dispatch({type: DISCONNECT_ACTION});
};
export const injectReducer = (name: string, reducer: Reducer<any, any>) => {
  reducers[name] = reducer;
  store.replaceReducer(createReducer(reducers));
};
export const resetReducers = () => {
  reducers = {};
  store.replaceReducer(createReducer());
};
export const customResetReducers = (keys: string[]) => {
  reducers = pickAll(keys, reducers);
  store.replaceReducer(createReducer(reducers));
};
