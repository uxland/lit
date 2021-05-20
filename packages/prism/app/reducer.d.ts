import {ScreenOrientationState} from './orientation/reducer';
import {GeoLocationState} from './geo-location/reducer';
import {Reducer} from 'redux';
export interface ApplicationState {
  initialized: boolean;
  online: boolean;
  orientation: ScreenOrientationState;
  geoLocation: GeoLocationState;
}
export declare const reducer: Reducer<ApplicationState>;
