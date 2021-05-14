import {Action, createAction} from '@uxland/redux';
import {Dispatch} from 'redux';
import {ScreenOrientationState, SET_ORIENTATION_ACTION} from './reducer';

const getOrientation = (orientation: string | number) => {
  orientation = String(orientation);
  return <ScreenOrientationState>{
    orientation: orientation,
    type: orientation === '0' ? 'portrait' : 'landscape',
  };
};

const setOrientationActionCreator = createAction<ScreenOrientationState>(SET_ORIENTATION_ACTION);

const setAppOrientation = (dispatch: Dispatch<Action>) =>
  dispatch(setOrientationActionCreator(getOrientation(window.orientation)));

let orientationChangeHandler: any;
export const init = (dispatch: Dispatch<Action>) => {
  if (orientationChangeHandler)
    window.removeEventListener('orientationchange', orientationChangeHandler);
  orientationChangeHandler = () => setAppOrientation(dispatch);
  window.addEventListener('orientationchange', orientationChangeHandler);
  setAppOrientation(dispatch);
};
