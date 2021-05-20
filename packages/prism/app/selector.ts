import {PrismAppState} from '../store';
import {ApplicationState} from './reducer';

export const appSelector: (state: PrismAppState) => ApplicationState = (state: PrismAppState) =>
  state ? state.app : undefined;
