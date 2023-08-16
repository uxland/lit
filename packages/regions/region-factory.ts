import {invariant} from '@uxland/utilities/invariant';
import {Region, RegionDefinition} from './region';
import {RegionAdapterRegistry} from './region-adapter-registry';
import {IRegionManager} from './region-manager';

const createAdapter = (
  definition: RegionDefinition,
  target: Element,
  adapterRegistry: RegionAdapterRegistry
) => {
  const adapterFactory = adapterRegistry.getAdapterFactory(target);
  invariant(typeof adapterFactory === 'function', 'No region adapter factory found for the host');
  return adapterFactory(definition, <any>target);
};
export const regionFactory = async (
  definition: RegionDefinition,
  host: Element,
  regionManager: IRegionManager,
  adapterRegistry: RegionAdapterRegistry
) => {
  await (host as any)._updatePromise;
  const target = host.shadowRoot.querySelector(`#${definition.targetId}`);
  if (target) {
    const adapter = definition.adapterFactory
      ? definition.adapterFactory(definition, <any>target)
      : createAdapter(definition, target, adapterRegistry);
    invariant(adapter, 'No region adapter found for the host');
    const targetRegionManager = definition.scoped
      ? regionManager.createRegionManager()
      : regionManager;
    const region = new Region(
      definition.name,
      targetRegionManager,
      target as any,
      adapter,
      definition
    );
    targetRegionManager.add(definition.name, region);
    return region;
  } else
    console.warn(
      `region host with id ${definition.targetId} not found for region named ${definition.name}`
    );
  return undefined;
};
