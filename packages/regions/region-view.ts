import {dedupeMixin, propertiesObserver} from '@uxland/lit-utilities';
import {Constructor} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {ViewDefinition} from './view-definition';

export declare class RegionViewMixin {
  active: boolean;
  activeChanged(current: boolean, previous: boolean);
  view: ViewDefinition;
  regionContext: unknown;
  regionContextChanged(current: unknown, previous: unknown);
}

const regionViewMixin = dedupeMixin(
  <T extends Constructor<LitElement>>(superClass: T): T & Constructor<RegionViewMixin> => {
    class RegionView extends propertiesObserver(superClass) {
      @property({type: Boolean})
      active: boolean;
      activeChanged(current: boolean, previous: boolean) {}
      view: ViewDefinition;
      @property()
      regionContext: unknown;
      regionContextChanged(newContext: unknown, oldContext: unknown) {}
    }
    return RegionView as Constructor<RegionViewMixin> & T;
  }
);

export function regionView<T extends Constructor<LitElement>>(superClass: T) {
  return regionViewMixin(superClass) as Constructor<RegionViewMixin> & T;
}
