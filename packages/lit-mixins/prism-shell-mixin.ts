import {dedupeMixin} from '@uxland/lit-utilities/dedupe-mixin';
import {routingSelectors} from '@uxland/routing/store/selectors';
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
    //@ts-ignore
    class mixin extends routing(superClass, routingSelectors) {}
    return mixin;
  })(superClass);
};
