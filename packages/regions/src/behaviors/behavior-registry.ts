import {IRegion, IRegionBehavior} from '../region.js';

export interface RegionBehaviorPrototype {
  new (region: IRegion): IRegionBehavior;
}

export class BehaviorRegistry implements BehaviorRegistry {
  private registry: RegionBehaviorPrototype[] = [];
  get behaviors(): RegionBehaviorPrototype[] {
    return [...this.registry];
  }

  register(behavior: RegionBehaviorPrototype) {
    if (!this.behaviors.some(b => b === behavior)) this.registry.push(behavior);
  }
}
