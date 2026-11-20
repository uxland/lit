import {createSelector} from 'reselect';
import {optionsSelector} from './options-selector';
import {PrismAppState} from '../store';

export const apiUrlSelector: (state: PrismAppState) => string = createSelector(
  optionsSelector,
  opt => (opt ? opt.apiUrl : undefined)
);
