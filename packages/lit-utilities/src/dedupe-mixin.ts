import {type Constructor, dedupeMixin as baseDedupeMixin} from '@uxland/utilities/dedupe-mixin.js';
import type {LitElement} from 'lit';

/**
 * Applies a mixin only once per class chain.
 *
 * Delegates to `@uxland/utilities` so that every mixin, whether it comes from this package or
 * from other uxland packages, shares the same registry of applied mixins.
 */
export function dedupeMixin<T extends Constructor<LitElement>>(mixin: any): (superClass: T) => T {
  return baseDedupeMixin(mixin);
}
