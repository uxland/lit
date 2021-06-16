import {nop} from '@uxland/utilities/nop';
import andThen from 'ramda/es/andThen';
import bind from 'ramda/es/bind';
import map from 'ramda/es/map';
import pipe from 'ramda/es/pipe';
import {IRegion, IRegionBehavior} from '../region';
export class AutoPopulateBehavior implements IRegionBehavior {
  constructor(private targetRegion: IRegion) {}
  async attach(): Promise<void> {
    const views = this.targetRegion.regionManager.getRegisteredViews(this.targetRegion.name);
    return pipe(
      map<any, Promise<any>>(view => this.targetRegion.addView(view.key, view.view)),
      bind(Promise.all, Promise),
      andThen(nop)
    )(views);
  }

  detach(): Promise<void> {
    return Promise.resolve();
  }
}
