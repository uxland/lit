import {dedupeMixin} from '@uxland/lit-utilities';
import {RoutingMixinConstructor} from '@uxland/routing';
import {Routing} from './mixins';

interface MixinFunction<T> {}
export type PrismShellMixinFunction = MixinFunction<RoutingMixinConstructor>;
export const PrismShellMixin: PrismShellMixinFunction = dedupeMixin(parent => {
  class mixin extends Routing(parent) {
    subroute = '/';
  }

  return <any>mixin;
});
