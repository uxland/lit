import {reducer as initialized} from './initialized/reducer';
import {reducer as online} from './online/reducer';
import {reducer as orientation, ScreenOrientationState} from './orientation/reducer';
import {reducer as geoLocation} from './geo-location/reducer';
import {combineReducers} from 'redux';
import {GeoLocationState} from './geo-location/reducer';
import {Reducer} from 'redux';

export interface ApplicationState {
  initialized: boolean;
  online: boolean;
  orientation: ScreenOrientationState;
  geoLocation: GeoLocationState;
}
export const reducer: Reducer<ApplicationState> = combineReducers({
  initialized,
  online,
  orientation,
  geoLocation,
});
