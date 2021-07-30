import {microTask} from '@uxland/browser-utilities/async/micro-task';
import {connectMixin} from '@uxland/redux/connect';
import {Constructor} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';
import {Store} from 'redux';
import {bind} from './bind';
import {unbind} from './unbind';

// export interface ConnectMixin {
//   __reduxStoreSubscriptions__: Unsubscribe[];
// }

// export type Selector<T = any> = (state: any) => T;

// export interface ConnectAddOn {
//   uxlReduxWatchedProperties: {[key: string]: PropertyWatch};
//   reduxDefaultStore: Store;
//   watchProperty: (name: PropertyKey, watch: PropertyWatch) => void;
// }

// export interface PropertyWatch {
//   selector: Selector;
//   store: Store;
//   name: string;
// }

// export type ConnectMixinConstructor = ConnectMixin & typeof LitElement;
export type ConnectMixinFunction = (superClass: typeof LitElement) => Constructor<LitElement>;

export const connect =
  <T extends Constructor<LitElement | any>>(defaultStore: Store<any, any>) =>
  (superClass: T) => {
    class litConnectMixin extends connectMixin(defaultStore)(superClass) {
      constructor(...args) {
        super(...args);
        microTask.run(() => {
          if (!this.bound) {
            this.bound = true;
            bind(this as unknown as LitElement);
          }
        });
      }

      disconnectedCallback(): void {
        unbind(this);
        //@ts-ignore
        super.disconnectedCallback && super.disconnectedCallback();
      }
    }

    return litConnectMixin as Constructor<LitElement> & T;
  };

// export function connect(defaultStore?: Store<any, any>): ConnectMixinFunction {
//   return dedupeMixin((superClass: typeof LitElement) => {
//     class connectMixin extends superClass implements ConnectMixin {
//       __reduxStoreSubscriptions__: Unsubscribe[];

//       private bound: boolean;

//       constructor() {
//         super();
//         microTask.run(() => {
//           if (!this.bound) {
//             this.bound = true;
//             bind(this);
//           }
//         });
//       }

//       static get reduxDefaultStore(): Store | undefined {
//         return defaultStore;
//       }

//       disconnectedCallback(): void {
//         unbind(this);
//         super.disconnectedCallback && super.disconnectedCallback();
//       }
//     }

//     return connectMixin;
//   });
// }

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
