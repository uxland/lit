import {createSelector} from 'reselect';
import {appSelector} from '../selector';
import {PrismAppState} from '../../store';
import {ScreenOrientationState} from './reducer';

export const orientationSelector: (state: PrismAppState) => ScreenOrientationState = createSelector(
  appSelector,
  app => app.orientation
);
