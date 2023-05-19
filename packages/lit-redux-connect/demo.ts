import {litLocale} from '@uxland/lit-mixins';
import {propertiesObserver} from '@uxland/lit-utilities';
import {regionHost} from '@uxland/regions';
import {LitElement} from 'lit';
import {customElement} from 'lit/decorators';

@customElement('demo')
export class Demo extends litLocale(regionHost(propertiesObserver(LitElement))) {}
