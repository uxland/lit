import {createBasicReducer} from '@uxland/redux';
import {Reducer} from 'redux';
import {actionsBuilder} from '../../constants';

export type ScreenOrientationType = 'landscape' | 'portrait';
export interface ScreenOrientationState {
  orientation: string;
  type: ScreenOrientationType;
}

export const SET_ORIENTATION_ACTION = actionsBuilder('set-orientation');
export const reducer: Reducer<ScreenOrientationState> = createBasicReducer<ScreenOrientationState>(
  SET_ORIENTATION_ACTION,
  {
    defValue: {type: null, orientation: ''},
  }
);
