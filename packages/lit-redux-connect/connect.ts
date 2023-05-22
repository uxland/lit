import {microTask} from '@uxland/browser-utilities/async/micro-task';
import {ConnectMixin as IConnectMixin} from '@uxland/redux/legacy/connect';
import {Constructor} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';
import {Store, Unsubscribe} from 'redux';
import {bind} from './bind';
import {unbind} from './unbind';

export declare class ConnectMixin implements IConnectMixin {
  bound: boolean;
  __reduxStoreSubscriptions__: Unsubscribe[];
}

export const connect =
  <T extends Constructor<LitElement>>(defaultStore: Store<any, any>) =>
  (superClass: T) => {
    class ConnectMixinClass extends superClass implements ConnectMixin {
      constructor(...args) {
        super(...args);
        microTask.run(() => {
          if (!this.bound) {
            this.bound = true;
            bind(this as unknown as LitElement);
          }
        });
      }

      bound: boolean;
      __reduxStoreSubscriptions__: Unsubscribe[];

      static get reduxDefaultStore(): Store | undefined {
        return defaultStore;
      }

      disconnectedCallback(): void {
        unbind(this);
        //@ts-ignore
        super.disconnectedCallback && super.disconnectedCallback();
      }
    }

    return ConnectMixinClass as Constructor<ConnectMixin> & T;
  };

/**
 * Connect mixin that provides redux functionalities and store access to parent class
 * @mixin
 * @memberof LitReduxConnect
 * @name connect
 * @since v1.0.0
 * @param {Store} store Store
 * @example
 *
 * mixin = connect(defaultStore);
 * BaseClass = class Base {
 *    baseProp = 'foo';
 * };
 * TestClass = class Test extends mixin(BaseClass) {};
 *
 * To avoid typescript typings when using with other mixins, it is recommended to declare the mixin function as follows:
 *
 * function mixin<T extends Constructor<LitElement>>(superClass: T) {
 *  return connect(store)(superClass) as Constructor<ConnectMixin> & T;
 * }
 */
export default connect;
