import {invariant} from '@uxland/utilities';
import {IRegion} from './region';
import {ViewDefinition} from './view-definition';

class Registry {
  private viewsByRegion: {
    [regionName: string]: {key: string; view: ViewDefinition}[];
  } = {};
  private regions: {[regionName: string]: IRegion[]} = {};
  registerRegion(regionName: string, region: IRegion) {
    this.regions[regionName] = [...(this.regions[regionName] || []), region];
  }
  unregisterRegion(name: string, region: IRegion) {
    this.regions[name] = this.getRegionsByName(name).filter(r => r !== region);
  }
  registerView(regionName: string, key: string, view: ViewDefinition) {
    this.viewsByRegion[regionName] = [
      ...(this.viewsByRegion[regionName] || []),
      {key: key, view: view},
    ];
  }

  getRegisteredViews(regionName: string): {key: string; view: ViewDefinition}[] {
    return this.viewsByRegion[regionName] || [];
  }
  getRegionsByName(regionName: string): IRegion[] {
    return this.regions[regionName] || [];
  }
  clear() {
    this.viewsByRegion = {};
    this.regions = {};
  }
}
const viewRegistry = new Registry();

export interface IRegionManager {
  add(name: string, region: IRegion): IRegionManager;

  getRegion(name: string): IRegion;

  remove(region: string | IRegion): IRegion;

  addViewToRegion(regionName: string, key: string, view: ViewDefinition): IRegionManager;

  registerViewWithRegion<T extends ViewDefinition = ViewDefinition>(
    regionName: string,
    key: string,
    view: T
  ): IRegionManager;

  getRegisteredViews(regionName: string): {key: string; view: ViewDefinition}[];

  clear(): IRegionManager;

  createRegionManager(): RegionManager;
}

export class RegionManager implements IRegionManager {
  private _regions: {[name: string]: IRegion} = {};

  add(name: string, region: IRegion): IRegionManager {
    //this.assertRegionCanBeAdded(name)
    invariant(!this.getRegion(name), 'A region with the same name already exists');
    this._regions[name] = region;
    viewRegistry.registerRegion(name, region);
    return this;
  }

  getRegion(name: string): IRegion {
    return this._regions[name];
  }

  remove(region: string | IRegion): IRegion {
    let result: IRegion;
    let regionName: string;
    if (typeof region === 'string') {
      result = this.getRegion(region as string);
      regionName = region;
      delete this._regions[region];
    }
    if (typeof region === 'object') {
      regionName = Object.keys(this._regions).find(
        regionName => this._regions[regionName] === region
      );
      if (regionName) {
        result = region;
        delete this._regions[regionName];
      }
    }
    if (regionName && result) viewRegistry.unregisterRegion(regionName, result);
    return result;
  }

  addViewToRegion(regionName: string, key: string, view: ViewDefinition): IRegionManager {
    const region = this.getRegion(regionName);
    invariant(region, `Couldn't find a region with name: ${regionName}`);
    region.addView(key, view);
    return this;
  }

  registerViewWithRegion<T extends ViewDefinition = ViewDefinition>(
    regionName: string,
    key: string,
    view: T
  ): IRegionManager {
    viewRegistry.registerView(regionName, key, view);
    viewRegistry.getRegionsByName(regionName).forEach(r => r.addView(key, view));
    return this;
  }

  getRegisteredViews(regionName: string): {key: string; view: ViewDefinition}[] {
    return viewRegistry.getRegisteredViews(regionName);
  }

  clear(): IRegionManager {
    Object.keys(this._regions).forEach(k => this.remove(k));
    this._regions = {};
    return this;
  }

  createRegionManager() {
    return new RegionManager();
  }
}
class MainRegionManager extends RegionManager {
  clear() {
    super.clear();
    viewRegistry.clear();
    return this;
  }
}
export const regionManager = new MainRegionManager();
