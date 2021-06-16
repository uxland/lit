import {PropertyDeclaration} from 'lit';
import {property} from 'lit/decorators.js';
import always from 'ramda/es/always';
import is from 'ramda/es/is';
import isNil from 'ramda/es/isNil';
import lensPath from 'ramda/es/lensPath';
import view from 'ramda/es/view';
import when from 'ramda/es/when';
import {Store} from 'redux';
import {ConnectAddOn, Selector} from './connect';
import {createWatchedReduxProperty} from './watched-redux-property';

const toLensSelector = (path: string) => view(lensPath(path.split('.')));
const getSelector = (selector: Selector | string) => when(is(String), toLensSelector)(selector);
const getStore = (store: Store, proto: any) =>
  when(isNil, always((<ConnectAddOn>proto.constructor).reduxDefaultStore))(store);

export interface WatchOptions {
  name?: string;
  selector?: string;
  store?: Store<any, any>;
  propertyOptions?: PropertyDeclaration;
}

export const watch =
  <T = any>(selector: Selector<T> | string, options: WatchOptions = {} as any) =>
  (proto: any, name: PropertyKey) => {
    createWatchedReduxProperty(
      {
        name: String(name),
        selector: getSelector(selector),
        store: getStore(options.store, proto),
      },
      proto,
      String(name)
    );
    if (proto.constructor.createProperty) property(options.propertyOptions)(proto, name);
  };
