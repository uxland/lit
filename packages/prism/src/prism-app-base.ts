import {watch} from '@uxland/lit-redux-connect';
import {LitElement} from 'lit-element';
import {appInitializedSelector} from './app/initialized/app-initialized-selector';
import {BootstrapOptions} from './bootstrapper';
import {Redux} from './mixins/redux';
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
export abstract class PrismAppBase extends Redux(LitElement) {
  options: BootstrapOptions = {
    fetchUser: undefined,
    fetchLogin: undefined,
    apiUrl: uxlPrism.settings.apiUrl,
    locales: {ca: {}},
    language: 'ca',
    appsBaseRoute: uxlPrism.settings.appsBaseRoute,
    moduleBaseRoute: '/',
  };
  connectedCallback() {
    super.connectedCallback();
    this.initApp();
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
