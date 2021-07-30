import {
  localeMixin,
  LocalizationMixin,
  localizerFactory,
  LocalizerFactory,
} from '@uxland/localization';
import {Constructor} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';

export type LocalizationMixinConstructor = LocalizationMixin & typeof LitElement;

export type LitLocaleMixinFunction = (
  superClass: typeof LitElement
) => LocalizationMixinConstructor;

export const litLocaleMixin =
  <T extends Constructor<LitElement | any>>(factory: LocalizerFactory) =>
  (superClass: T) => {
    return localeMixin(factory)(superClass);
  };

export const litLocale = litLocaleMixin(localizerFactory);
