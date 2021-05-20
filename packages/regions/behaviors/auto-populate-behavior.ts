import {nop} from '@uxland/utilities';
import * as R from 'ramda';
import {IRegion, IRegionBehavior} from '../region';
export class AutoPopulateBehavior implements IRegionBehavior {
  constructor(private targetRegion: IRegion) {}
  async attach(): Promise<void> {
    const views = this.targetRegion.regionManager.getRegisteredViews(this.targetRegion.name);
    return R.pipe(
      R.map<any, Promise<any>>(view => this.targetRegion.addView(view.key, view.view)),
      R.bind(Promise.all, Promise),
      R.andThen(nop)
    )(views);
  }

  detach(): Promise<void> {
    return Promise.resolve();
  }
}
