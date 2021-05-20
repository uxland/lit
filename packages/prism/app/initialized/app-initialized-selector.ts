import {createSelector} from 'reselect';
import {appSelector} from '../selector';
import {PrismAppState} from '../../store';

export const appInitializedSelector: (state: PrismAppState) => boolean = createSelector(
  appSelector,
  app => app.initialized
);
