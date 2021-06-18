import {subscribe} from '@uxland/event-aggregator/event-aggregator';
import {watch} from '@uxland/lit-redux-connect/watch';
import {LitElement} from 'lit';
import {appInitializedSelector} from './app/initialized/app-initialized-selector';
import {BootstrapOptions} from './bootstrapper';
import {LOGOUT_EVENT} from './disconnect';
import {redux} from './mixins/redux';
import {isLoggedInSelector, userIsFetchingSelector} from './user/selectors';
import {MainViewType} from './view';
import {setView} from './view/set-view';
export interface Settings {
  apiUrl: string;
  logoutUrl?: string;
  propagateCredentials?: boolean;
  autoLogin?: boolean;
  autoLoginUserName?: string;
  autoLoginPassword?: string;
  initialDelay?: number;
  appsBaseRoute?: string;
  offlineEnabled?: boolean;
}
export interface UxlPrism {
  settings: Settings;
}

declare interface Window {
  uxlPrism: UxlPrism;
}
declare let uxlPrism: UxlPrism;
export abstract class PrismAppBase extends redux(LitElement) {
  options: BootstrapOptions = {
    fetchUser: undefined,
    fetchLogin: undefined,
    apiUrl: uxlPrism?.settings?.apiUrl,
    locales: {ca: {}},
    language: 'ca',
    appsBaseRoute: uxlPrism?.settings?.appsBaseRoute,
    moduleBaseRoute: '/',
    appHostSelector: undefined,
  };

  connectedCallback() {
    super.connectedCallback();
    this.initApp();
    subscribe(LOGOUT_EVENT, () => {
      if (this.options.appHostSelector) {
        const host = this.renderRoot.querySelector(this.options.appHostSelector);
        Array.from(host.children).forEach((c: HTMLElement) => {
          host.removeChild(c);
          const element = document.createElement(c.localName);
          element.setAttribute('name', c.getAttribute('name'));
          host.appendChild(element);
        });
      }
    });
  }
  protected abstract initApp();
  protected getPagePath(page: any): string {
    return null;
  }
  private _currentView: string;

  @watch(isLoggedInSelector)
  loggedIn: boolean;
  @watch(appInitializedSelector)
  initialized: boolean;
  public get currentView(): string {
    const view: MainViewType = !this.initialized ? 'splash' : this.loggedIn ? 'shell' : 'login';
    if (view !== this._currentView) this._currentView = view;
    setView(view);
    return view;
  }
  @watch(userIsFetchingSelector)
  isFetching: boolean;
}
