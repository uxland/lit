import {Action} from '@uxland/redux/create-action';
import {Dispatch} from 'redux';
import {init as initAppOnline} from './online/init';
import {init as initOrientation} from './orientation/init';
const initMethods = [initAppOnline, initOrientation];
export const init = (dispatch: Dispatch<Action>) => initMethods.forEach(i => i(dispatch));
