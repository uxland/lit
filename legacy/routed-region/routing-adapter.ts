import {SelectableAdapter} from '@uxland/regions/adapters/selectable-adapter';
import {IRegion, IRegionAdapter, IRegionBehavior, IRegionHost} from '@uxland/regions/region';
import {ViewComponent, ViewDefinition} from '@uxland/regions/view-definition';
import {Router} from '@uxland/routing/router';
import {Store} from 'redux';
import {RouterRegionDefinition} from './router-region-decorator';
import {RoutingRegionBehavior} from './routing-region-behavior';

export interface RoutedViewDefinition extends ViewDefinition {
  route: string;
}
export const getParentRoutedRegion: (element: any) => IRegion = element => {
  if (!element.host && !element.parentNode) return null;
  const host = element.host || element.parentNode.host || element.parentNode;
  if (host.uxlRegion) {
    const region: IRegion = host.uxlRegion;
    if (region.adapter.constructor === RoutingAdapter) return region;
  }
  return getParentRoutedRegion(host);
};
export const getFullRoute = (
  host: any,
  regionDefinition: RouterRegionDefinition,
  trailerRoute?: string
) => {
  const routes = [regionDefinition.route];
  if (trailerRoute) routes.push(trailerRoute);
  let current = regionDefinition.route;
  while (current != '') {
    const parent = getParentRoutedRegion(host);
    if (parent) current = (parent.adapter as RoutingAdapter).regionDefinition.route;
    else current = '';
    routes.unshift(current);
  }
  return routes.join('/');
};

interface Handler<T = any> {
  canNavigateFrom?: (url: string, params?: T, query?: string) => Promise<boolean>;
  navigatedFrom?: (url: string, params?: T, query?: string) => Promise<boolean>;
}

class RoutedViewHandler {
  public view: HTMLElement & ViewComponent & Handler;

  canNavigateFrom(url: string, params?: any, queryString?: any | string): Promise<boolean> {
    if (this.view && this.view.canNavigateFrom)
      return this.view.canNavigateFrom(url, params, queryString);
    return Promise.resolve(true);
  }
  navigatedFrom(url: string, params?: any, query?: any | string): Promise<boolean> {
    if (this.view && this.view.navigatedFrom) return this.view.navigatedFrom(url, params, query);
    return Promise.resolve(true);
  }
}
export class RoutingAdapter extends SelectableAdapter implements IRegionAdapter {
  constructor(
    host: IRegionHost & Element,
    protected router: Router,
    protected store: Store<any, any>,
    public regionDefinition: RouterRegionDefinition
  ) {
    super(host);
  }
  private handlers = new WeakMap<ViewDefinition, RoutedViewHandler>();
  get behaviors(): IRegionBehavior[] {
    return [
      ...super.behaviors,
      new RoutingRegionBehavior(this.host, this.router, this.store, this.regionDefinition),
    ];
  }
  viewAdded(view: RoutedViewDefinition) {
    const p = super.viewAdded(view);
    const handler = new RoutedViewHandler();
    this.handlers.set(view, handler);
    this.router.registerRoutes({
      route: getFullRoute(this.host, this.regionDefinition, view.route),
      hooks: {
        canNavigateFrom: handler.canNavigateFrom,
        navigatedFrom: handler.navigatedFrom,
      },
    });
    return p;
  }
  activateView(view: HTMLElement & ViewComponent) {
    const handler = this.handlers.get(view.view);
    if (handler && !handler.view) handler.view = view;
    return super.activateView(view);
  }
}
