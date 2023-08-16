import {subscribe} from '@uxland/event-aggregator';
import {setBaseUrl} from '@uxland/fetch-client/fetch-client';
import {bind} from '@uxland/lit-redux-connect/bind';
import {watch} from '@uxland/lit-redux-connect/watch';
import {propertiesObserver} from '@uxland/lit-utilities/properties-observer';
import {setLanguage} from '@uxland/localization/language';
import {setLocales} from '@uxland/localization/locales';
import {PropertyWatch} from '@uxland/redux/connect';
import {regionManager} from '@uxland/regions/region-manager';
import equals from 'ramda/es/equals';
import unary from 'ramda/es/unary';
import {Unsubscribe} from 'redux';
import {init as initApp} from './app/init';
import {appInitializedSelector, setAppInitialized} from './app/initialized';
import {LOGOUT_EVENT} from './disconnect';
import {apiUrlSelector, appsBaseRouteSelector, setOptions} from './options';
import {init as initRouter, router} from './router';
import {store} from './store';
import {
  fetchLoginFunc,
  fetchUser,
  fetchUserFunc,
  ModuleInfo,
  modulesSelector,
  setUserFetch,
  setUserLogin,
} from './user';

export interface IBootstrapper {
  run(): Promise<any>;
}

export type ModuleInfoRefresh = ModuleInfo[] | {modules: ModuleInfo[]; refresh: boolean};

export interface BootstrapOptions {
  language: string;
  locales?: any;
  fetchUser: string | fetchUserFunc;
  fetchLogin: string | fetchLoginFunc;
  initialRoute?: string;
  moduleBaseRoute?: string;
  apiUrl?: string;
  appsBaseRoute?: string;
  appHostSelector?: string;
}

const initializeLocalization = (language: string, locales: unknown, formats?: any) => {
  if (language) setLanguage(language);
  if (locales) setLocales(locales);
  if (formats) setFormats(formats);
};

export interface IModule {
  initialize(moduleInfo: ModuleInfo, refresh?: boolean): Promise<any>;

  dispose(moduleInfo: ModuleInfo, refresh?: boolean): Promise<any>;
}

export type ModulePostFn = <T = any>(
  mi: ModuleInfo,
  refresh?: boolean
) => (module: IModule) => Promise<T>;

const moduleInitializer: ModulePostFn = (mi, refresh) => module => module.initialize(mi, refresh);
const moduleDisposer: ModulePostFn = (mi, refresh) => module => module.dispose(mi, refresh);

export abstract class Bootstrapper
  extends propertiesObserver(<any>Object)
  implements IBootstrapper
{
  private static __uxlReduxWatchedProperties: {[key: string]: PropertyWatch};
  __reduxStoreSubscriptions__: Unsubscribe[];
  @watch(modulesSelector, {store})
  modules: ModuleInfoRefresh;
  @watch(appInitializedSelector, {store})
  appInitialized: boolean;
  @watch(appsBaseRouteSelector, {store})
  appsBaseRoute: string;
  @watch(apiUrlSelector, {store})
  apiUrl: string;

  constructor(protected options: BootstrapOptions) {
    super();
    bind(<any>this);
  }

  protected static get uxlReduxWatchedProperties(): {
    [key: string]: PropertyWatch;
  } {
    if (!this.__uxlReduxWatchedProperties) this.__uxlReduxWatchedProperties = {};
    return this.__uxlReduxWatchedProperties;
  }

  public static watchProperty(name: PropertyKey, options: PropertyWatch) {
    this.uxlReduxWatchedProperties[String(name)] = options;
  }

  async run(): Promise<any> {
    setAppInitialized(false);
    setBaseUrl(this.options.apiUrl);
    setOptions({
      appsBaseRoute: this.options.appsBaseRoute,
      modulesBaseRootPath: this.options.moduleBaseRoute,
      apiUrl: this.options.apiUrl,
    });
    initializeLocalization(this.options.language, this.options.locales);
    initApp(store.dispatch);
    await this.initializeUser();
    await this.handleModulesChanged(this.modules);
    initRouter(store);
    setAppInitialized(true);
    await router.navigate(window.location.href);
  }

  modulesChanged(modules: ModuleInfoRefresh, old: ModuleInfoRefresh) {
    if (this.appInitialized) this.handleModulesChanged(modules, old);
  }

  apiUrlChanged(apiUrl: string) {
    setBaseUrl(apiUrl);
  }

  protected abstract moduleLoader(
    postFn: ModulePostFn,
    appsBaseRout: string,
    refresh?: boolean
  ): (moduleInfo: ModuleInfo) => Promise<any>;

  private async initializeUser() {
    setUserLogin(this.options.fetchLogin);
    setUserFetch(this.options.fetchUser);
    try {
      await fetchUser();
    } catch (e) {
      console.log(e);
    }
  }

  protected async handleModulesChanged(modules: ModuleInfoRefresh, oldModules?: ModuleInfoRefresh) {
    if (!equals(modules, oldModules)) {
      await this.runModules(
        Array.isArray(oldModules) ? oldModules : oldModules?.modules,
        moduleDisposer,
        (oldModules as {modules: ModuleInfo[]; refresh: boolean})?.refresh
      );
      await this.runModules(
        Array.isArray(modules) ? modules : modules?.modules,
        moduleInitializer,
        (modules as {modules: ModuleInfo[]; refresh: boolean})?.refresh
      );
    }
  }

  private runModules(
    modules: ModuleInfo[] = [],
    postFn: ModulePostFn,
    refresh = false
  ): Promise<any> {
    const loader = this.moduleLoader(postFn, this.appsBaseRoute, refresh);
    return Promise.all(modules.map(unary(loader))).catch(e => console.log(e));
  }
}

subscribe(LOGOUT_EVENT, () => {
  regionManager.clear();
  router.navigate(window.location.href).then();
});
function setFormats(formats: any) {
  throw new Error('Function not implemented.');
}
