import {connect} from '@uxland/lit-redux-connect';
import {watch} from '@uxland/lit-redux-connect/watch';
import {isRouteActive, Route, RoutingSelectors} from '@uxland/routing';
import {Constructor, dedupeMixin} from '@uxland/utilities/dedupe-mixin';
import {LitElement, notEqual, PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';
import {Store} from 'redux';

interface MixinFunction<T> {}

export interface RoutingMixin<TParams = any> {
  isRouteActive: boolean;
  route: Route;
  params: TParams;
  query: string;
  subroute: string;
  isRouteActiveChanged(current: boolean, previous: boolean): any;
  paramsChanged(current: unknown, previous: unknown): any;
  queryChanged(current: string, previous: string);
  routeChanged(current: Route, previous: Route): any;
}

// export interface RoutingMixinConstructor<TParams = any> extends ConnectMixinConstructor {
//   new (...args: any[]): RoutingMixin<TParams> & ConnectMixinFunction & LitElement;
// }

// export type RoutingMixinFunction<TParams = any> = MixinFunction<
//   RoutingMixinConstructor<TParams>
// >;

// type RoutingMixinFunction = <TParams = any>(
//   superClass: typeof ConnectMixin
// ) => RoutingMixinConstructor<TParams>;

export type RoutingMixinFunction = (superClass: typeof LitElement) => Constructor<LitElement>;

export function routing<TParams>(store: Store, selectors: RoutingSelectors): RoutingMixinFunction {
  return dedupeMixin((superClass: typeof LitElement) => {
    const watchOptions = {store};
    class RoutingMixinClass extends connect(store)(superClass) implements RoutingMixin<TParams> {
      @property()
      subroute: string;
      @watch(selectors.routeSelector, watchOptions)
      route: Route;
      @watch(selectors.currentParamsSelector, watchOptions)
      params: TParams;
      @watch(selectors.currentQuerySelector, watchOptions)
      query: string;
      @property()
      isRouteActive = false;

      update(changedProps: PropertyValues) {
        const active = isRouteActive(this.route, this.subroute);
        if (notEqual(active, this.isRouteActive)) {
          const previous = this.isRouteActive;
          this.isRouteActive = active;
          this.isRouteActiveChanged(this.isRouteActive, previous);
        }
        return super.update(changedProps);
      }

      routeChanged(current: Route, previous: Route) {}
      isRouteActiveChanged(current: boolean, previous: boolean): void {}
      paramsChanged(current: unknown, previous: unknown) {}
      queryChanged(current: string, previous: string) {}
    }
    return RoutingMixinClass;
  });
}
