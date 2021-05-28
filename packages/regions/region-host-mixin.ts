import {AsyncQueue} from '@uxland/browser-utilities/async/async-queue';
import {dedupeMixin} from '@uxland/lit-utilities/dedupe-mixin';
import {LitElement} from 'lit';
import * as R from 'ramda';
import {factory} from './adapters/multiple-active-adapter';
import {IRegion, IRegionBehavior, RegionDefinition} from './region';
import {regionAdapterRegistry, RegionAdapterRegistry} from './region-adapter-registry';
import {regionsProperty} from './region-decorator';
import {regionFactory} from './region-factory';
import {IRegionManager, regionManager} from './region-manager';

type Constructor<T = Record<string, unknown>> = new (...args: any[]) => T;

export interface RegionHostMixin extends LitElement {
  regionsCreated(newRegions: IRegion[]): void;
}

export interface RegionHostMixinConstructor extends Constructor<LitElement> {
  new (...args: any[]): RegionHostMixin;
}

interface MixinFunction<T> {}
export type RegionHostMixinFunction = MixinFunction<RegionHostMixinConstructor>;

interface RegionDefinitionArgs {
  key: string;
  definition: RegionDefinition;
}

const requiresCreation: (
  component: RegionHostMixin
) => (definition: RegionDefinitionArgs) => boolean = component => definition =>
  R.pipe(R.prop(definition.key), R.isNil)(component);

const requiresDeletion: (
  component: RegionHostMixin
) => (definition: RegionDefinitionArgs) => boolean = component => definition =>
  !requiresCreation(component)(definition) &&
  R.isNil(component.shadowRoot.querySelector(`#${definition.definition.targetId}`));

const deleteRegion: (
  component: RegionHostMixin
) => (definition: RegionDefinitionArgs) => Promise<RegionDefinitionArgs> = component => args => {
  const region: IRegion = component[args.key];
  region.regionManager.remove(region);
  const behaviors = region.adapter ? region.adapter.behaviors || [] : [];
  delete component[args.key];
  return R.pipe(
    R.map((b: IRegionBehavior) => b.detach),
    R.bind(Promise.all, Promise),
    R.andThen(() => delete component[args.key]),
    R.andThen(R.always(undefined))
  )(behaviors);
};

const createRegion: (
  component: RegionHostMixin,
  rm: IRegionManager,
  registry: RegionAdapterRegistry
) => (definitionArgs: RegionDefinitionArgs) => Promise<RegionDefinitionArgs> =
  (component, rm, registry) => definitionArgs =>
    regionFactory(definitionArgs.definition, component, rm, registry)
      .then(region => {
        if (region) {
          component[definitionArgs.key] = region;
          const behaviors = region.adapter ? region.adapter.behaviors || [] : [];
          return R.pipe(
            R.map((b: IRegionBehavior) => b.attach()),
            R.bind(Promise.all, Promise),
            R.andThen(R.always(region))
          )(behaviors);
        } else return undefined;
      })
      .catch(R.always(undefined));

const toRegionDefinitionArgs: (regions: RegionDefinitions) => RegionDefinitionArgs[] = regions =>
  R.pipe(
    R.keys,
    R.map(key => <RegionDefinitionArgs>{key, definition: regions[key]})
  )(regions);

type RegionDefinitions = {[key: string]: RegionDefinition};
const getUxlRegions: (item: any) => RegionDefinitions = item =>
  item.constructor[regionsProperty] || {};

const handleRegionCreation = (
  component: RegionHostMixin,
  regionManager1: IRegionManager,
  registry: RegionAdapterRegistry
) => {
  const creationRequired = requiresCreation(component);
  const deletionRequired = requiresDeletion(component);
  const deletion = deleteRegion(component);
  const creation = createRegion(component, regionManager1, registry);
  return (args: RegionDefinitionArgs) =>
    R.cond([
      [creationRequired, creation],
      [deletionRequired, deletion],
      [R.T, R.always(Promise.resolve(undefined))],
    ])(args);
};

export const regionHostMixin = (
  RegionManager: IRegionManager,
  adapterRegistry: RegionAdapterRegistry
) =>
  dedupeMixin(<T extends Constructor<LitElement>>(superClass: T) => {
    class RegionHostMixinClass extends superClass implements RegionHostMixin {
      constructor(...args: any[]) {
        super();
        this.enqueuer = new AsyncQueue(this.runRegionCreation.bind(this));
      }
      public enqueuer;
      protected updated(_changedProperties: Map<PropertyKey, unknown>): void {
        super.updated(_changedProperties);
        this.create();
      }
      private createRegions(): Promise<any> {
        const regions = getUxlRegions(this);
        const handleCreation = handleRegionCreation(this as any, regionManager, adapterRegistry);
        return R.pipe(
          toRegionDefinitionArgs,
          R.forEach(handleCreation),
          R.bind(Promise.all, Promise),
          R.andThen(R.reject(R.isNil)),
          R.andThen(R.bind(this.regionsCreated, this))
        )(regions);
      }
      private create() {
        this.enqueuer.enqueueItem();
      }
      private runRegionCreation() {
        return new Promise<any>(resolve => {
          this.createRegions().then(resolve).catch(resolve);
        });
      }
      regionsCreated(newRegions: IRegion[]) {}
      disconnectedCallback(): void {
        super.disconnectedCallback();
        const regions = getUxlRegions(this);
        Object.keys(regions).forEach(name => {
          const region = this[name] as IRegion;
          if (region) {
            region.regionManager.remove(region);
            const behaviors = region.adapter ? region.adapter.behaviors || [] : [];
            behaviors.forEach(b => b.detach());
          }
        });
      }
    }
    return RegionHostMixinClass;
  });

regionAdapterRegistry.registerDefaultAdapterFactory(factory);

export const regionHost: RegionHostMixinFunction = regionHostMixin(
  regionManager,
  regionAdapterRegistry
);
