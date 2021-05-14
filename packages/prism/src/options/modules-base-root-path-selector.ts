import {createSelector} from 'reselect';
import {optionsSelector} from './options-selector';
import {PrismAppState} from '../store';

export const modulesBaseRootPathSelector: (state: PrismAppState) => string = createSelector(
  optionsSelector,
  opt => (opt ? opt.modulesBaseRootPath : undefined)
);
