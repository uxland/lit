import {createSelector} from 'reselect';
import {PrismAppState} from '../../store';
import {appSelector} from '../selector';

export const appInitializedSelector: (state: PrismAppState) => boolean = createSelector(
  appSelector,
  app => app.initialized
);
