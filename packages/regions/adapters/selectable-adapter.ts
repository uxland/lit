import {IRegionHost} from '../region';
import {ViewComponent} from '../view-definition';
import {SingleActiveAdapter} from './single-active-adapter';

export class SelectableAdapter extends SingleActiveAdapter {
  protected attrForSelected = 'name';
  protected attrForSelectedProperty = 'attrForSelected';
  protected selectedProperty = 'selected';
  constructor(host: IRegionHost) {
    super(host);
    host[this.attrForSelectedProperty] = this.attrForSelected;
  }
  async activateView(view: HTMLElement & ViewComponent): Promise<any> {
    await super.activateView(view);
    if (!view[this.attrForSelected]) view[this.attrForSelected] = view.viewKey;
    this.host[this.selectedProperty] = view.viewKey;
    return undefined;
  }
  async deactivateView(view: HTMLElement & ViewComponent): Promise<any> {
    if (this.host[this.selectedProperty] === view.viewKey) {
      this.host[this.selectedProperty] = null;
      await super.deactivateView(view);
    }
    return undefined;
  }
}
export const factory = (definition, target) => new SelectableAdapter(target);
