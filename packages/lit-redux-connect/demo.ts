import {litLocale} from '@uxland/lit-mixins';
import {propertiesObserver} from '@uxland/lit-utilities';
import {regionHost, regionView} from '@uxland/regions';
import {LitElement} from 'lit';
import {customElement} from 'lit/decorators';

@customElement('demo')
export class Demo extends litLocale(regionView(regionHost(propertiesObserver(LitElement)))) {
  constructor() {
    super();
    this.localize;
    this.activeChanged;
    this.regionsCreated;
  }
}
