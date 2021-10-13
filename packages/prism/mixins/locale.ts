import {watch} from '@uxland/lit-redux-connect/watch';
import {
  LocalizationMixin,
  Localizer,
  localizerFactory,
  LocalizerFactory,
} from '@uxland/localization';
import {Constructor} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';
import {formatsSelector, languageSelector, localesSelector} from '../state/localization';
import {redux} from './redux';

interface PrismLocalizationMixin extends LocalizationMixin, LitElement {}

const localeMixin =
  <T extends Constructor<LitElement | any>>(factory: LocalizerFactory) =>
  (superClass: T) => {
    class localeMixin extends redux(superClass as any) implements LocalizationMixin {
      useKeyIfMissing = false;

      @watch(localesSelector)
      locales: Record<string, any>;

      @watch(languageSelector)
      language: string;

      @watch(formatsSelector)
      formats: string;

      get localize(): Localizer {
        return factory(this.language, this.locales, this.formats, this.useKeyIfMissing);
      }
    }
    return localeMixin as Constructor<PrismLocalizationMixin> & T;
  };

export function prismLocale<T extends Constructor<LitElement>>(superClass: T) {
  return localeMixin<T>(localizerFactory)(superClass);
}
