import {createSelector} from 'reselect';
import {optionsSelector} from './options-selector';
import {PrismAppState} from '../store';

export const appsBaseRouteSelector: (state: PrismAppState) => string = createSelector(
  optionsSelector,
  opt => (opt ? opt.appsBaseRoute : undefined)
);
