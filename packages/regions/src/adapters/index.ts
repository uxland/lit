export * from './adapter-base.js';
export {
  MultipleActiveAdapter,
  factory as multipleActiveAdapterFactory,
  /** @deprecated Use `multipleActiveAdapterFactory`. */
  factory as multipleActiveAdapterFaactory,
} from './multiple-active-adapter.js';
export {SelectableAdapter, factory as selectableAdapterFactory} from './selectable-adapter.js';
export {
  SingleActiveAdapter,
  factory as singleActiveAdapterFactory,
} from './single-active-adapter.js';
