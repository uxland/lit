import {getBrowserLang} from '@uxland/browser-utilities';
import {
  Bootstrapper,
  ModuleInfo,
  ModulePostFn,
  PrismAppBase,
  setView,
  UserInfo,
} from '@uxland/prism';
import {locales} from './locales';
import {toCamelCase} from './utilities';

const submodules = {
  // module: (): Promise<unknown> => import("@monorepo/module/src/main"),
};

class AppBootstrapper extends Bootstrapper {
  protected moduleLoader(
    postFn: ModulePostFn,
    appBaseRoute: string
  ): (moduleInfo: ModuleInfo) => Promise<any> {
    return async function (moduleInfo: ModuleInfo): Promise<any> {
      try {
        const importer = submodules[toCamelCase(moduleInfo.folder)];
        const module = await importer();
        return postFn(moduleInfo)(module);
      } catch (error) {
        console.log(error);
      }
    };
  }
}

export class AppBase extends PrismAppBase {
  constructor() {
    super();
    this.options = {
      ...this.options,
      language: getBrowserLang(),
      locales,
      fetchUser: (): Promise<any> => this.doFetchUser(),
      fetchLogin: (username, password): Promise<any> => this.doLogin(username, password),
    };
  }

  protected initApp() {
    const bootstrapper = new AppBootstrapper(this.options);
    return bootstrapper.run();
  }

  get currentView() {
    const view =
      !this.initialized || this.isFetching ? 'splash' : this.loggedIn ? 'shell' : 'login';
    // @ts-ignore
    if (view !== this._currentView) {
      // @ts-ignore
      this._currentView = view;
    }
    setView(view);
    return view;
  }

  private async doLogin(username: string, password: string): Promise<UserInfo | any> {
    return Promise.resolve({
      // modules: [{ folder: modules.module, moduleId: modules.module }],
    });
  }

  private async doFetchUser(): Promise<UserInfo | any> {
    return Promise.resolve({
      // modules: [{ folder: modules.module, moduleId: modules.module }],
    });
  }
}
