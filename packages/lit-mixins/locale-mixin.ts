import {subscribe} from '@uxland/event-aggregator';
import {
  FORMATTERS_RESET,
  FORMATTERS_UPDATED,
  LANGUAGE_RESET,
  LANGUAGE_UPDATED,
  LOCALES_RESET,
  LOCALES_UPDATED,
  LocalizationMixin,
  Localizer,
  localizerFactory,
  LocalizerFactory,
} from '@uxland/localization';
import {Constructor} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';

interface LitLocalizationMixin extends LocalizationMixin, LitElement {}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
let formats: any = {};
let language = 'en';
let locales: Record<string, any> = {};
const useKeyIfMissing = false;

export const litLocaleMixin =
  <T extends Constructor<LitElement | any>>(factory: LocalizerFactory) =>
  (superClass: T) => {
    class localeMixin extends superClass implements LocalizationMixin {
      localize: Localizer;
      useKeyIfMissing: boolean = useKeyIfMissing;
      formats: any = formats;
      language = language;
      locales: Record<string, any> = locales;
      constructor(...args) {
        super(...args);
        subscribe(LOCALES_UPDATED, this.localesChanged.bind(this));
        subscribe(LOCALES_RESET, this.localesChanged.bind(this));
        subscribe(LANGUAGE_UPDATED, this.languageChanged.bind(this));
        subscribe(LANGUAGE_RESET, this.languageChanged.bind(this));
        subscribe(FORMATTERS_UPDATED, this.formattersChanged.bind(this));
        subscribe(FORMATTERS_RESET, this.formattersChanged.bind(this));
        //this.localize = factory(language, locales, formats, useKeyIfMissing);
        this.buildLocalize(language, locales, formats, useKeyIfMissing);
        this.requestUpdate();
      }

      private localesChanged(newLocales: Record<string, any>): void {
        locales = newLocales;
        this.locales = newLocales;
        //this.localize = factory(language, locales, formats, useKeyIfMissing);
        this.buildLocalize(language, locales, formats, useKeyIfMissing);
      }
      public languageChanged(newLanguage: string): void {
        language = newLanguage;
        this.language = newLanguage;
        //this.localize = factory(language, locales, formats, useKeyIfMissing);
        this.buildLocalize(language, locales, formats, useKeyIfMissing);
      }
      public formattersChanged(newFormats: string): void {
        formats = newFormats;
        this.formats = newFormats;
        //this.localize = factory(language, locales, formats, useKeyIfMissing);
        this.buildLocalize(language, locales, formats, useKeyIfMissing);
      }

      private buildLocalize(
        language: string,
        locales: Record<string, any>,
        formats: any,
        useKeyIfMissing: boolean
      ) {
        this.localize = factory(language, locales, formats, useKeyIfMissing);
        this.requestUpdate();
      }
    }
    return localeMixin as Constructor<LitLocalizationMixin> & T;
    //return localeMixin(factory)(superClass) as Constructor<LitLocalizationMixin> & T;
  };

export function litLocale<T extends Constructor<LitElement>>(superClass: T) {
  return litLocaleMixin<T>(localizerFactory)(superClass);
}
