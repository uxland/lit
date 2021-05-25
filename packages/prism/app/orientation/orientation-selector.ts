import {createSelector} from 'reselect';
import {PrismAppState} from '../../store';
import {appSelector} from '../selector';
import {ScreenOrientationState} from './reducer';

export const orientationSelector: (state: PrismAppState) => ScreenOrientationState = createSelector(
  appSelector,
  app => app.orientation
);
