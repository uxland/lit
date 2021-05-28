import {bind, getWatchedProperties, PropertyWatch, unbind, watch} from '@uxland/lit-redux-connect';
import {IRegionBehavior, IRegionHost} from '@uxland/regions/region';
import {findMatchingRoutes} from '@uxland/routing/helpers/finding-matching-routes';
import {isRouteActive} from '@uxland/routing/helpers/is-route-active';
import {Route, RouteDefinition, Router} from '@uxland/routing/router';
import {computePage} from '@uxland/routing/store/compute-page';
import {routingSelectors} from '@uxland/routing/store/selectors';
import {Store} from 'redux';
import {RouterRegionDefinition} from './router-region-decorator';
import {getFullRoute, RoutedViewDefinition} from './routing-adapter';

interface ViewRoute extends RouteDefinition {
  view: RoutedViewDefinition;
}

const getActiveView: (
  currentRoute: Route,
  defaultPage: string,
  isRouteActive: boolean,
  availableViews: RoutedViewDefinition[]
) => RoutedViewDefinition = (currentRoute, defaultPage, isRouteActive, availableViews) => {
  if (isRouteActive && currentRoute) {
    const matching = findMatchingRoutes(
      currentRoute.href,
      availableViews.map(v => ({
        route: defaultPage + '/' + v.route,
        view: v,
      }))
    );
    if (matching.length) {
      return (matching[0].route as ViewRoute).view as RoutedViewDefinition;
    }
  }
  return null;
};

export class RoutingRegionBehavior implements IRegionBehavior {
  constructor(
    private host: IRegionHost & Element,
    private router: Router,
    private store: Store<any, any>,
    private definition: RouterRegionDefinition
  ) {
    const properties: {[key: string]: PropertyWatch} = getWatchedProperties(
      RoutingRegionBehavior.prototype
    );
    Object.values(properties)
      .filter(x => x.store === null || x.store === undefined)
      .forEach(x => (x.store = store));
    bind(<any>this);
  }

  private fullRoute: string;

  attach(): Promise<void> {
    this.fullRoute = getFullRoute(this.host, this.definition);
    if (!this.definition.route || this.definition.route === '/')
      this.router.registerRoutes({route: '/'});
    return Promise.resolve();
  }

  detach(): Promise<void> {
    unbind(this);
    return Promise.resolve();
  }

  @watch(routingSelectors.routeSelector)
  route: any;
  requestUpdate() {
    const routeActive = isRouteActive(this.route, this.fullRoute);
    if (routeActive) {
      const activeView = getActiveView(
        this.route,
        this.fullRoute,
        true,
        this.host.uxlRegion.currentViews as RoutedViewDefinition[]
      );
      let view;
      if (activeView) {
        view = activeView;
      } else {
        const page =
          computePage(this.route, this.definition.defaultPage, routeActive, this.fullRoute) ||
          this.definition.defaultPage;
        view = getActiveView(
          {...this.route, href: page},
          this.fullRoute,
          true,
          this.host.uxlRegion.currentViews as RoutedViewDefinition[]
        );
      }

      if (view) this.host.uxlRegion.activate(view);
      else this.host.uxlRegion.deactivate(this.host.uxlRegion.currentActiveViews[0]);
    }
    return Promise.resolve(true);
  }
}
