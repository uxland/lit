import {microTask} from '@uxland/browser-utilities/async/micro-task';
import {dedupeMixin} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';
import {Store, Unsubscribe} from 'redux';
import {bind} from './bind';
import {unbind} from './unbind';

export interface ConnectMixin {
  __reduxStoreSubscriptions__: Unsubscribe[];
}

export type Selector<T = any> = (state: any) => T;

export interface ConnectAddOn {
  uxlReduxWatchedProperties: {[key: string]: PropertyWatch};
  reduxDefaultStore: Store;
  watchProperty: (name: PropertyKey, watch: PropertyWatch) => void;
}

export interface PropertyWatch {
  selector: Selector;
  store: Store;
  name: string;
}

export type ConnectMixinConstructor = ConnectMixin & typeof LitElement;
export type ConnectMixinFunction = (superClass: typeof LitElement) => ConnectMixinConstructor;

export function connect(defaultStore?: Store<any, any>): ConnectMixinFunction {
  return dedupeMixin((superClass: typeof LitElement) => {
    class connectMixin extends superClass implements ConnectMixin {
      __reduxStoreSubscriptions__: Unsubscribe[];

      private bound: boolean;

      constructor() {
        super();
        microTask.run(() => {
          if (!this.bound) {
            this.bound = true;
            bind(this);
          }
        });
      }

      static get reduxDefaultStore(): Store | undefined {
        return defaultStore;
      }

      disconnectedCallback(): void {
        unbind(this);
        super.disconnectedCallback && super.disconnectedCallback();
      }
    }

    return connectMixin;
  });
}

// export const connect: (defaultStore?: Store<any, any>) => ConnectMixinFunction =
//   (defaultStore) =>
//     dedupeMixin((superClass: Constructor<LitElement>) => {
//       class connectMixin extends superClass implements ConnectMixin {
//         __reduxStoreSubscriptions__: Unsubscribe[];

//         private bound: boolean;

//         constructor() {
//           super();
//           microTask.run(() => {
//             if (!this.bound) {
//               this.bound = true;
//               bind(this);
//             }
//           });
//         }

//         static get reduxDefaultStore(): Store | undefined {
//           return defaultStore;
//         }

//         disconnectedCallback(): void {
//           unbind(this);
//           super.disconnectedCallback && super.disconnectedCallback();
//         }
//       }

//       return connectMixin;
//     });
export default connect;
