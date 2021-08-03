import {Action, createAction} from '@uxland/redux/create-action';
import {store} from '../store';
import {OptionsState, SET_OPTIONS_ACTION} from './reducer';

const setOptionsCreator = createAction<OptionsState>(SET_OPTIONS_ACTION);
export const setOptions: (options: OptionsState) => Action<OptionsState> = (
  options: OptionsState
) => store.dispatch(setOptionsCreator(options));
