import {
  localeMixin,
  LocalizationMixin,
  localizerFactory,
  LocalizerFactory,
} from '@uxland/localization';
import {dedupeMixin} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';

export type LocalizationMixinConstructor = LocalizationMixin & typeof LitElement;

export type LitLocaleMixinFunction = (
  superClass: typeof LitElement
) => LocalizationMixinConstructor;

export function litLocaleMixin(factory: LocalizerFactory): LitLocaleMixinFunction {
  return dedupeMixin((superClass: typeof LitElement) => localeMixin(factory)(superClass));
}

export const litLocale = litLocaleMixin(localizerFactory);
