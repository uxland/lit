import {regionAdapterRegistry} from '@uxland/regions';
import {routingAdapterFactory} from '@uxland/routed-region';
import {initializeLinkClickSupport, Router, RouterState} from '@uxland/routing';
import {Store} from 'redux';
import {PrismAppState, store} from './store';

export const router: Router = new RouterState(store.dispatch, [], window.location.origin);
export const init: (store: Store<PrismAppState>) => void = (store: Store<PrismAppState>) => {
  initializeLinkClickSupport(router);
};

regionAdapterRegistry.registerDynamicAdapterFactory(routingAdapterFactory(router, store));
