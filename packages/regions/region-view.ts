import {propertiesObserver} from '@uxland/lit-utilities';
import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {ViewDefinition} from './view-definition';

type Constructor<T = Record<string, unknown>> = new (...args: any[]) => T;

export interface RegionView extends LitElement {
  active: boolean;
  activeChanged(current: boolean, previous: boolean);
  view: ViewDefinition;
  regionContext: any;
  regionContextChanged(current: any, previous: any);
}

export interface RegionViewMixin extends RegionView {}

export const regionView = <T extends Constructor<LitElement>>(superClass: T) => {
  class RegionView extends propertiesObserver(superClass) implements RegionViewMixin {
    @property({type: Boolean})
    active: boolean;
    activeChanged(current: boolean, previous: boolean) {}
    view: ViewDefinition;
    @property()
    regionContext: any;
    regionContextChanged(newContext: any, oldContext: any) {}
  }
  return RegionView as Constructor<RegionViewMixin> & T;
};
