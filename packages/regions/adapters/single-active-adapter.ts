import {ViewComponent, ViewDefinition} from '../view-definition';
import {AdapterBase} from './adapter-base';

export class SingleActiveAdapter extends AdapterBase {
  async activateView(view: HTMLElement & ViewComponent): Promise<any> {
    const activeViews = this.host.uxlRegion.currentActiveViews.filter(v => v !== view.view);
    for (const v of activeViews) await this.host.uxlRegion.deactivate(v);
    return super.activateView(view);
  }

  async deactivateView(view: HTMLElement & ViewComponent): Promise<any> {
    await super.deactivateView(view);
    const defaultView = this.host.uxlRegion.currentViews.find(v => v.isDefault);
    if (
      defaultView &&
      view.view != defaultView &&
      this.host.uxlRegion.currentActiveViews.length == 0
    )
      await this.host.uxlRegion.activate(defaultView);
  }

  async viewAdded(view: ViewDefinition) {
    if (!this.host.uxlRegion.currentActiveViews.length && view.isDefault)
      await this.host.uxlRegion.activate(view);
  }
}
export const factory = (definition, target) => new SingleActiveAdapter(target);
