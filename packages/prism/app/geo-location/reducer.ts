import {Action} from '@uxland/redux/create-action';
import {actionsBuilder} from '../../constants';

export interface GeoLocationState {
  lastKnownPosition: Position;
  registeredWatchers: {[key: string]: any};
}
export const SET_LAST_POSITION_ACTION = actionsBuilder('set-last-position');
export const REGISTER_GEO_LOCATION_WATCHER = actionsBuilder('register-geo-location-watcher');
export const UNREGISTER_GEO_LOCATION_WATCHER = actionsBuilder('unregister-geo-location-watcher');
export const reducer: (state: GeoLocationState, action: Action) => GeoLocationState = (
  state: GeoLocationState = {lastKnownPosition: null, registeredWatchers: {}},
  action: Action
) => {
  let newWatchers;
  switch (action.type) {
    case SET_LAST_POSITION_ACTION:
      return {...state, lastKnownPosition: action.payload};
    case REGISTER_GEO_LOCATION_WATCHER:
      return {
        ...state,
        registeredWatchers: {
          ...state.registeredWatchers,
          [action.meta]: action.payload,
        },
      };
    case UNREGISTER_GEO_LOCATION_WATCHER:
      newWatchers = {...state.registeredWatchers};
      if (newWatchers[action.meta]) {
        delete newWatchers[action.meta];
        return {...state, registeredWatchers: newWatchers};
      }
  }
  return state;
};
