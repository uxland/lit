import {connect, ConnectMixinFunction} from '@uxland/lit-redux-connect/connect';
import {store} from '../store';

export const redux: ConnectMixinFunction = connect(<any>store);
