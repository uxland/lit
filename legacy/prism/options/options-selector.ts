import {PrismAppState} from '../store';
import {OptionsState} from './reducer';

export const optionsSelector: (state: PrismAppState) => OptionsState = (state: PrismAppState) =>
  state ? state.options : undefined;
