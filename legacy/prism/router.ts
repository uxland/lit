import {regionAdapterRegistry} from '@uxland/regions/region-adapter-registry';
import {routingAdapterFactory} from '@uxland/routed-region/routing-adapter-factory-factory';
import {initializeLinkClickSupport} from '@uxland/routing/link-click-support';
import {Router} from '@uxland/routing/router';
import {RouterState} from '@uxland/routing/store/router-state';
import {Store} from 'redux';
import {PrismAppState, store} from './store';

export const router: Router = new RouterState(store.dispatch, [], window.location.origin);
export const init: (store: Store<PrismAppState>) => void = (store: Store<PrismAppState>) => {
  initializeLinkClickSupport(router);
};

regionAdapterRegistry.registerDynamicAdapterFactory(routingAdapterFactory(router, store));
