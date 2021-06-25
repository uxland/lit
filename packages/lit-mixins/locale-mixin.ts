import {
  localeMixin,
  LocalizationMixin,
  localizerFactory,
  LocalizerFactory,
} from '@uxland/localization';
import {dedupeMixin} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';

export interface LocalizationMixinConstructor extends LitElement {
  new (...args: any[]): LocalizationMixin & LitElement;
}
type Constructor<T = Record<string, unknown>> = new (...args: any[]) => T;
export type LitLocaleMixinFunction = (
  superClass: Constructor<LitElement>
) => LocalizationMixinConstructor;

export function litLocaleMixin(factory: LocalizerFactory): LitLocaleMixinFunction {
  return dedupeMixin((superClass: typeof LitElement) => localeMixin(factory)(superClass));
}

export const litLocale = litLocaleMixin(localizerFactory);
