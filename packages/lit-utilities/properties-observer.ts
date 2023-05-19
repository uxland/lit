import {notEqual} from 'lit';
import defaultTo from 'ramda/es/defaultTo';
import pipe from 'ramda/es/pipe';
import {dedupeMixin} from './dedupe-mixin';

const getPropertyComponentComparer = (name: PropertyKey, component: any) =>
  component.constructor._classProperties
    ? component.constructor._classProperties.get(name).hasChanged
    : undefined;
const comparer = pipe(getPropertyComponentComparer, defaultTo(notEqual));

export const propertiesObserver = dedupeMixin(superClass => {
  class PropertiesObserver extends superClass {
    requestUpdate(name, oldValue) {
      const result = super.requestUpdate
        ? super.requestUpdate(name, oldValue)
        : Promise.resolve(null);
      if (comparer(name, this)(this[name], oldValue)) {
        if (this[`${String(name)}Changed`]) this[`${String(name)}Changed`](this[name], oldValue);
      }

      return result;
    }
  }
  return PropertiesObserver;
});
