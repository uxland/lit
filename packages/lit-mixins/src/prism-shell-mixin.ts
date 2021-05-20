import {dedupeMixin} from '@uxland/lit-utilities';
import {routingSelectors} from '@uxland/routing';
import {routing, RoutingMixinConstructor} from './routing';

interface MixinFunction<T> {}
export type PrismShellMixinFunction = MixinFunction<RoutingMixinConstructor>;
// export const PrismShellMixin: PrismShellMixinFunction = dedupeMixin(
//   (parent) => {
//     class mixin extends routing(parent, routingSelectors) {
//       subroute = "/";
//     }

//     return <any>mixin;
//   }
// );

export const prismShellMixin = superClass => {
  return dedupeMixin(superClass => {
    class mixin extends routing(superClass, routingSelectors) {}
    return mixin;
  })(superClass);
};
