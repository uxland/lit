import {Constructor} from '@uxland/utilities/dedupe-mixin';
import {LitElement, notEqual} from 'lit';
import defaultTo from 'ramda/es/defaultTo';
import pipe from 'ramda/es/pipe';
import {dedupeMixin} from './dedupe-mixin';

export interface PropertiesObserverMixin {}

const getPropertyComponentComparer = (name: PropertyKey, component: any) =>
  component.constructor._classProperties
    ? component.constructor._classProperties.get(name).hasChanged
    : undefined;
const comparer = pipe(getPropertyComponentComparer, defaultTo(notEqual));

export const propertiesObserver = dedupeMixin(
  <T extends Constructor<LitElement>>(
    superClass: T
  ): T & Constructor<PropertiesObserverMixin & LitElement> => {
    class PropertiesObserver extends superClass {
      updated(changedProperties) {
        super.updated(changedProperties);
        changedProperties.forEach((oldValue, propName) => {
          if (comparer(propName, this)(this[propName], oldValue)) {
            if (this[`${String(propName)}Changed`])
              this[`${String(propName)}Changed`](this[propName], oldValue);
          }
        });
      }
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
  }
);
