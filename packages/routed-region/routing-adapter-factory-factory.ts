import {IRegionHost} from '@uxland/regions/region';
import {DynamicFactory} from '@uxland/regions/region-adapter-registry';
import {Router} from '@uxland/routing';
import {Store} from 'redux';
import {RouterRegionDefinition} from './router-region-decorator';
import {RoutingAdapter} from './routing-adapter';

export const routingAdapterFactoryFactory =
  (router: Router, store: Store<any, any>) =>
  (definition: RouterRegionDefinition, host: Element & IRegionHost) =>
    new RoutingAdapter(host, router, store, definition);

export const routingAdapterFactory: (router: Router, store: Store<any, any>) => DynamicFactory = (
  router,
  store
) => {
  const adapterFactory = routingAdapterFactoryFactory(router, store);
  return host =>
    host['router-region'] || host.hasAttribute('router-region') ? adapterFactory : undefined;
};
