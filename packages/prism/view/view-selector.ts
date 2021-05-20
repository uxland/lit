import {PrismAppState} from '../store';
import {MainViewType} from './reducer';

export const viewSelector: (state: PrismAppState) => MainViewType = (state: PrismAppState) =>
  state.view;
