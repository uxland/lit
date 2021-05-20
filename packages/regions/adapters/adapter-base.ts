import {defaultBehaviorRegistry} from '../behaviors/default-registry';
import {IRegionAdapter, IRegionBehavior, IRegionHost} from '../region';
import {ViewComponent, ViewDefinition} from '../view-definition';

export class AdapterBase implements IRegionAdapter {
  constructor(public host: IRegionHost) {}

  get behaviors(): IRegionBehavior[] {
    return defaultBehaviorRegistry.behaviors.map(b => new b(this.host.uxlRegion));
  }

  activateView(view: HTMLElement & ViewComponent): Promise<any> {
    if (!this.host.contains(view)) this.addViewToHost(view);
    view.hidden = false;
    return Promise.resolve(undefined);
  }

  deactivateView(view: HTMLElement & ViewComponent): Promise<any> {
    if (view.view && view.view.removeFromDomWhenDeactivated) {
      this.removeViewFromHost(view);
    } else view.hidden = true;
    return Promise.resolve(null);
  }

  removeView(view: HTMLElement & ViewComponent) {
    this.removeViewFromHost(view);
  }

  viewAdded(view: ViewDefinition) {}

  protected addViewToHost(view: HTMLElement & ViewComponent) {
    this.host.appendChild(view);
  }

  protected removeViewFromHost(view: HTMLElement & ViewComponent) {
    this.host.removeChild(view);
    this.host.uxlRegion.viewRemovedFromDom(view.view);
  }
}
