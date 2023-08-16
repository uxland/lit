import {litLocale} from '@uxland/lit-mixins';
import {propertiesObserver} from '@uxland/lit-utilities';
import {regionHost, regionView} from '@uxland/regions';
import {Constructor} from '@uxland/utilities';
import {LitElement} from 'lit';
import {customElement} from 'lit/decorators';
import {createStore} from 'redux';
import connect, {ConnectMixin} from './connect';

function redux<T extends Constructor<LitElement>>(superClass: T) {
  return connect(createStore(null))(superClass) as Constructor<ConnectMixin> & T;
}

@customElement('demo')
export class Demo extends redux(regionHost(regionView(litLocale(propertiesObserver(LitElement))))) {
  constructor() {
    super();
    this.localize;
    this.activeChanged;
    this.regionsCreated;
  }
}
