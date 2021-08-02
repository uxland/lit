import {
  localeMixin,
  LocalizationMixin,
  localizerFactory,
  LocalizerFactory,
} from '@uxland/localization';
import {Constructor} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';

interface LitLocalizationMixin extends LocalizationMixin, LitElement {}

export const litLocaleMixin =
  <T extends Constructor<LitElement | any>>(factory: LocalizerFactory) =>
  (superClass: T) => {
    return localeMixin(factory)(superClass) as Constructor<LitLocalizationMixin> & T;
  };

export function litLocale<T extends Constructor<LitElement>>(superClass: T) {
  return litLocaleMixin<T>(localizerFactory)(superClass);
}
