import {store} from '../store';
import {ConnectMixinFunction, connect} from '@uxland/lit-redux-connect';

export const Redux: ConnectMixinFunction = connect(<any>store);
