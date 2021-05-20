import {ModuleInfo} from './user';
import {appsBaseRouteSelector} from './options';
import {store} from './store';
import * as settings from './polymer/settings';
export const calculateModuleBaseRoute: (moduleInfo: ModuleInfo) => string = moduleInfo =>
  moduleInfo.url
    ? moduleInfo.url.substring(0, moduleInfo.url.indexOf('/main.js'))
    : `${settings['rootPath']}${appsBaseRouteSelector(store.getState())}${moduleInfo.folder}`;
