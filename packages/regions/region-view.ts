import {dedupeMixin, propertiesObserver} from '@uxland/lit-utilities';
import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {ViewDefinition} from './view-definition';

export type RegionViewMixinConstructor = RegionViewMixin & typeof LitElement;

export type RegionViewMixinFunction = (superClass: typeof LitElement) => RegionViewMixinConstructor;

export interface RegionView extends LitElement {
  active: boolean;
  activeChanged(current: boolean, previous: boolean);
  view: ViewDefinition;
  regionContext: any;
  regionContextChanged(current: any, previous: any);
}

export interface RegionViewMixin extends RegionView {}

export function regionViewMixin(): RegionViewMixinFunction {
  return dedupeMixin((superClass: typeof LitElement) => {
    class RegionView extends propertiesObserver(superClass) implements RegionViewMixin {
      @property({type: Boolean})
      active: boolean;
      activeChanged(current: boolean, previous: boolean) {}
      view: ViewDefinition;
      @property()
      regionContext: any;
      regionContextChanged(newContext: any, oldContext: any) {}
    }
    return RegionView;
  });
}

export const regionView = regionViewMixin();
