import type {PropertyDeclaration} from 'lit';
import {dedupeMixin} from './dedupe-mixin.js';

type HasChanged = (value: unknown, oldValue: unknown) => boolean;

/** Same comparison Lit uses by default: strict inequality, treating NaN as equal to NaN. */
const notEqual: HasChanged = (value, oldValue) =>
  // biome-ignore lint/suspicious/noSelfCompare: NaN check
  oldValue !== value && (oldValue === oldValue || value === value);

const getHasChanged = (
  component: any,
  name: PropertyKey,
  options?: PropertyDeclaration
): HasChanged =>
  options?.hasChanged ?? component.constructor.elementProperties?.get(name)?.hasChanged ?? notEqual;

/**
 * Calls `<property>Changed(newValue, oldValue)` on the element every time a reactive property
 * changes, using the property's own `hasChanged` when it declares one.
 */
export const propertiesObserver = dedupeMixin(superClass => {
  class PropertiesObserver extends superClass {
    requestUpdate(...args: unknown[]) {
      const [name, oldValue, options] = args as [PropertyKey, unknown, PropertyDeclaration];
      const result = super.requestUpdate?.(...args);
      const self = this as Record<PropertyKey, any>;
      if (name !== undefined && getHasChanged(this, name, options)(self[name], oldValue)) {
        self[`${String(name)}Changed`]?.(self[name], oldValue);
      }
      return result;
    }
  }
  return PropertiesObserver;
});
