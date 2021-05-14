import {regionAdapterRegistry} from '@uxland/regions';
import {initializeLinkClickSupport, Router} from '@uxland/routing';
import {routingAdapterFactory} from '@uxland/uxl-routed-region';
import {Store} from 'redux';
import {PrismAppState, store} from './store';

export const router: Router = new Router(store.dispatch, window.location.origin);
export const init: (store: Store<PrismAppState>) => void = (store: Store<PrismAppState>) => {
  initializeLinkClickSupport(router);
};

regionAdapterRegistry.registerDynamicAdapterFactory(routingAdapterFactory(router, store));
