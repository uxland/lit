import type {IRegion, IRegionBehavior} from '../region.js';

export class AutoPopulateBehavior implements IRegionBehavior {
  constructor(private targetRegion: IRegion) {}

  async attach(): Promise<unknown> {
    const views = this.targetRegion.regionManager.getRegisteredViews(this.targetRegion.name);
    await Promise.all(views.map(view => this.targetRegion.addView(view.key, view.view)));
    return undefined;
  }

  detach(): Promise<unknown> {
    return Promise.resolve();
  }
}
