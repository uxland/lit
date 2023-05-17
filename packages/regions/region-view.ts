import {dedupeMixin, propertiesObserver} from '@uxland/lit-utilities';
import {Constructor} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {ViewDefinition} from './view-definition';

export interface RegionView {
  active: boolean;
  activeChanged(current: boolean, previous: boolean);
  view: ViewDefinition;
  regionContext: any;
  regionContextChanged(current: any, previous: any);
}

export interface RegionViewMixin extends RegionView {}

export const regionView = dedupeMixin(
  <T extends Constructor<LitElement>>(
    superClass: T
  ): T & Constructor<RegionViewMixin & LitElement> => {
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
  }
);
