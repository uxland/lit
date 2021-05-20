import {connect, ConnectMixinFunction} from '@uxland/lit-redux-connect';
import {store} from '../store';

export const redux: ConnectMixinFunction = connect(<any>store);
