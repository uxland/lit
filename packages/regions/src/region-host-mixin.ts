import {AsyncQueue} from '@uxland/browser-utilities/async/async-queue.js';
import {dedupeMixin} from '@uxland/lit-utilities';
import type {Constructor} from '@uxland/utilities/dedupe-mixin.js';
import type {LitElement} from 'lit';
import {factory} from './adapters/multiple-active-adapter.js';
import type {IRegion, RegionDefinition} from './region.js';
import {type RegionAdapterRegistry, regionAdapterRegistry} from './region-adapter-registry.js';
import {regionsProperty} from './region-decorator.js';
import {findRegionTarget, regionFactory} from './region-factory.js';
import {type IRegionManager, regionManager} from './region-manager.js';

/** Region definitions keyed by the host property that will hold each created region. */
export type RegionDefinitions = Record<string, RegionDefinition>;

export declare class RegionHostMixin {
  /**
   * Regions this host manages, keyed by the property that will hold each region.
   *
   * Defaults to the regions declared with `@region`. Override it to declare regions per instance
   * (for example from an attribute), and call `refreshRegions()` when the definitions change.
   */
  readonly regionDefinitions: RegionDefinitions;
  /**
   * Creates the regions whose target element exists and is not created yet, and removes the ones
   * whose target element is gone. Runs automatically after every update of the host.
   */
  refreshRegions(): void;
  /** Called after a refresh that created at least one region, with the regions just created. */
  regionsCreated(newRegions: IRegion[]): void;
}

/** Regions declared with the `@region` decorator on the host's class. */
export const getDeclaredRegions = (host: object): RegionDefinitions =>
  ((host.constructor as any)[regionsProperty] as RegionDefinitions) ?? {};

const behaviorsOf = (region: IRegion) => region.adapter?.behaviors ?? [];

const removeRegion = async (host: any, key: string) => {
  const region: IRegion = host[key];
  region.regionManager.remove(region);
  delete host[key];
  await Promise.all(behaviorsOf(region).map(behavior => behavior.detach()));
};

const createRegion = async (
  host: any,
  key: string,
  definition: RegionDefinition,
  manager: IRegionManager,
  registry: RegionAdapterRegistry
): Promise<IRegion | undefined> => {
  const region = await regionFactory(definition, host, manager, registry);
  if (!region) return undefined;
  host[key] = region;
  await Promise.all(behaviorsOf(region).map(behavior => behavior.attach()));
  return region;
};

const syncRegion = async (
  host: any,
  key: string,
  definition: RegionDefinition,
  manager: IRegionManager,
  registry: RegionAdapterRegistry
): Promise<IRegion | undefined> => {
  try {
    if (host[key] == null) return await createRegion(host, key, definition, manager, registry);
    if (!findRegionTarget(host, definition.targetId)) await removeRegion(host, key);
  } catch (error) {
    console.warn(`region "${definition.name}" could not be synchronised`, error);
  }
  return undefined;
};

export const regionHostMixin = <T extends Constructor<LitElement>>(
  manager: IRegionManager,
  adapterRegistry: RegionAdapterRegistry
) =>
  dedupeMixin((superClass: T) => {
    class RegionHostMixinClass extends superClass implements RegionHostMixin {
      enqueuer: AsyncQueue;

      constructor(...args: any[]) {
        super(...args);
        this.enqueuer = new AsyncQueue(() => this.syncRegions());
      }

      get regionDefinitions(): RegionDefinitions {
        return getDeclaredRegions(this);
      }

      protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        super.updated(changedProperties);
        this.refreshRegions();
      }

      refreshRegions() {
        this.enqueuer.enqueueItem();
      }

      /** @deprecated Use `refreshRegions()`. */
      create() {
        this.refreshRegions();
      }

      regionsCreated(_newRegions: IRegion[]) {}

      private async syncRegions() {
        const results = await Promise.all(
          Object.entries(this.regionDefinitions).map(([key, definition]) =>
            syncRegion(this, key, definition, manager, adapterRegistry)
          )
        );
        const created = results.filter((region): region is IRegion => region !== undefined);
        if (created.length) this.regionsCreated(created);
      }

      disconnectedCallback(): void {
        super.disconnectedCallback();
        for (const key of Object.keys(this.regionDefinitions)) {
          const region = (this as any)[key] as IRegion | undefined;
          if (region) {
            region.regionManager.remove(region);
            for (const behavior of behaviorsOf(region)) behavior.detach();
          }
        }
      }
    }
    return RegionHostMixinClass as unknown as Constructor<RegionHostMixin> & T;
  });

regionAdapterRegistry.registerDefaultAdapterFactory(factory);

export function regionHost<T extends Constructor<LitElement>>(superClass: T) {
  return regionHostMixin(
    regionManager,
    regionAdapterRegistry
  )(superClass) as Constructor<RegionHostMixin> & T;
}
