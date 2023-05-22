import {connect, ConnectMixin} from '@uxland/lit-redux-connect/connect';
import {Constructor} from '@uxland/utilities';
import {LitElement} from 'lit';
import {store} from '../store';

export function redux<T extends Constructor<LitElement>>(superClass: T) {
  return connect(store)(superClass) as Constructor<ConnectMixin> & T;
}
