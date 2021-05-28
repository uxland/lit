import {collect} from '@uxland/utilities/collect';
import {WatchOptions} from './watch';

const WATCHED_PROPERTIES_PROPERTY = 'watchedReduxProperties';

export const createWatchedReduxProperty = (
  propConfig: WatchOptions,
  proto: any,
  propName: string
) => {
  const properties = Object.keys(Object.assign({}, proto.constructor.watchedReduxProperties))
    .filter(
      key =>
        !proto.__proto__.constructor.watchedReduxProperties ||
        !proto.__proto__.constructor.watchedReduxProperties[key]
    )
    .reduce(
      (previousValue, currentValue) => {
        return {
          ...previousValue,
          [currentValue]: proto.constructor.watchedReduxProperties[currentValue],
        };
      },
      {[propName]: propConfig}
    );

  Object.defineProperty(proto.constructor, WATCHED_PROPERTIES_PROPERTY, {
    get() {
      return properties;
    },
    enumerable: true,
    configurable: true,
  });
};
export const getWatchedProperties = (proto: any) =>
  collect(proto.constructor, WATCHED_PROPERTIES_PROPERTY);
