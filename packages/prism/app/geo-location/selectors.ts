import {createSelector} from 'reselect';
import {appSelector} from '../selector';
import {PrismAppState} from '../../store';
import {GeoLocationState} from './reducer';

export const geoLocationSelector: (state: PrismAppState) => GeoLocationState = createSelector(
  appSelector,
  app => (app ? app.geoLocation : undefined)
);
export const lastKnownPositionSelector: (state: PrismAppState) => Position = createSelector(
  geoLocationSelector,
  gl => (gl ? gl.lastKnownPosition : undefined)
);
export const registeredWatchersSelector: (state: PrismAppState) => {[key: string]: any} =
  createSelector(geoLocationSelector, gl => (gl ? gl.registeredWatchers : undefined));
