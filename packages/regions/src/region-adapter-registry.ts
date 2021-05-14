import {IRegionAdapter, IRegionHost, RegionDefinition} from './region';

export type adapterFactory = (
  definition: RegionDefinition,
  target: Element & IRegionHost
) => IRegionAdapter;
export interface DynamicFactory {
  (host: Element): adapterFactory;
}
const defaultAdapterKey = 'default';
const dynamicAdapterKey = 'dynamic';
export class RegionAdapterRegistry {
  adapterRegistry = new Map<any, adapterFactory | DynamicFactory[]>();

  constructor() {
    this.adapterRegistry.set(dynamicAdapterKey, []);
  }

  registerAdapterFactory(key: any, adapter: adapterFactory) {
    this.adapterRegistry.set(key, adapter);
  }

  get dynamicFactories(): DynamicFactory[] {
    return this.adapterRegistry.get(dynamicAdapterKey) as DynamicFactory[];
  }

  registerDynamicAdapterFactory(factory: DynamicFactory) {
    if (this.dynamicFactories.indexOf(factory) === -1) this.dynamicFactories.push(factory);
  }

  getDynamicFactory(host: Element): adapterFactory {
    return this.dynamicFactories.reduce(
      (previousValue, currentValue) => previousValue || currentValue(host),
      <adapterFactory>null
    );
  }

  getAdapterFactory(host: Element): adapterFactory {
    const dynamicFactory = this.getDynamicFactory(host);
    if (dynamicFactory) return dynamicFactory;
    if (this.adapterRegistry.has(host.constructor))
      return this.adapterRegistry.get(host.constructor) as adapterFactory;
    if (this.adapterRegistry.has(host.localName))
      return this.adapterRegistry.get(host.localName) as adapterFactory;
    if (this.adapterRegistry.has(host.tagName))
      return this.adapterRegistry.get(host.tagName) as adapterFactory;
    if (this.adapterRegistry.has(defaultAdapterKey))
      return this.adapterRegistry.get(defaultAdapterKey) as adapterFactory;
    return null;
  }

  registerDefaultAdapterFactory(factory: adapterFactory) {
    this.adapterRegistry.set(defaultAdapterKey, factory);
  }
}
export const regionAdapterRegistry = new RegionAdapterRegistry();
