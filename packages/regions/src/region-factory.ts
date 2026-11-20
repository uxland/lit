import {invariant} from '@uxland/utilities/invariant.js';
import {Region, type RegionDefinition} from './region.js';
import type {RegionAdapterRegistry} from './region-adapter-registry.js';
import type {IRegionManager} from './region-manager.js';

const createAdapter = (
  definition: RegionDefinition,
  target: Element,
  adapterRegistry: RegionAdapterRegistry
) => {
  const adapterFactory = adapterRegistry.getAdapterFactory(target);
  invariant(typeof adapterFactory === 'function', 'No region adapter factory found for the host');
  return adapterFactory(definition, <any>target);
};

/**
 * Finds the element a region renders into. Looks in the host's render root, so it works both for
 * hosts with a shadow root and for hosts that render in light DOM (`createRenderRoot() { return this; }`).
 */
export const findRegionTarget = (host: Element, targetId: string): Element | null => {
  const root: ParentNode = (host as any).renderRoot ?? host.shadowRoot ?? host;
  return root.querySelector(`#${CSS.escape(targetId)}`);
};

export const regionFactory = async (
  definition: RegionDefinition,
  host: Element,
  regionManager: IRegionManager,
  adapterRegistry: RegionAdapterRegistry
) => {
  await (host as any).updateComplete;
  const target = findRegionTarget(host, definition.targetId);
  if (!target) {
    console.warn(
      `region host with id ${definition.targetId} not found for region named ${definition.name}`
    );
    return undefined;
  }
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
};
