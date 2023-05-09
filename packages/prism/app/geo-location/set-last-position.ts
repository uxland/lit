import {Action, createAction} from '@uxland/redux/create-action';
import {store} from '../../store';
import {Position} from './get-last-location';
import {SET_LAST_POSITION_ACTION} from './reducer';

const setLastPositionActionCreator = createAction<Position>(SET_LAST_POSITION_ACTION);
export const setLastPosition: (position: Position) => Action<Position> = (position: Position) =>
  store.dispatch(setLastPositionActionCreator(position));
