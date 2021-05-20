import {createSelector} from 'reselect';
import {appSelector} from '../selector';
import {PrismAppState} from '../../store';

export const onlineSelector: (state: PrismAppState) => boolean = createSelector(
  appSelector,
  app => app.online
);
