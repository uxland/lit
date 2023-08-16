import {createSelector} from 'reselect';
import {PrismAppState} from '../../store';
import {appSelector} from '../selector';

export const onlineSelector: (state: PrismAppState) => boolean = createSelector(
  appSelector,
  app => app.online
);
