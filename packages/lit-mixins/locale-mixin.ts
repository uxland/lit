import {subscribe, Subscription} from '@uxland/event-aggregator';
import {dedupeMixin} from '@uxland/lit-utilities';
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

export declare class LitLocalizationMixin implements LocalizationMixin {
  localize: Localizer;
  useKeyIfMissing: boolean;
  formats: any;
  language: string;
  locales: Record<string, any>;
}

let formats: unknown = {};
let language = 'en';
let locales: Record<string, unknown> = {};
const useKeyIfMissing = false;

export const litLocaleMixin = <T extends Constructor<LitElement>>(factory: LocalizerFactory) =>
  dedupeMixin((superClass: T) => {
    class localeMixin extends superClass implements LitLocalizationMixin {
      localize: Localizer;
      useKeyIfMissing: boolean = useKeyIfMissing;
      formats: unknown = formats;
      language = language;
      locales: Record<string, unknown> = locales;
      private subscriptions: Subscription[] = [];
      constructor(...args) {
        super(...args);
        this.subscriptions.push(
          subscribe(LOCALES_UPDATED, this.localesChanged.bind(this)),
          subscribe(LOCALES_RESET, this.localesChanged.bind(this)),
          subscribe(LANGUAGE_UPDATED, this.languageChanged.bind(this)),
          subscribe(LANGUAGE_RESET, this.languageChanged.bind(this)),
          subscribe(FORMATTERS_UPDATED, this.formattersChanged.bind(this)),
          subscribe(FORMATTERS_RESET, this.formattersChanged.bind(this))
        );
        //this.localize = factory(language, locales, formats, useKeyIfMissing);
        this.buildLocalize(language, locales, formats, useKeyIfMissing);
        this.requestUpdate();
      }

      private localesChanged(newLocales: Record<string, unknown>): void {
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
        locales: Record<string, unknown>,
        formats: unknown,
        useKeyIfMissing: boolean
      ) {
        this.localize = factory(language, locales, formats, useKeyIfMissing);
        this.requestUpdate();
      }

      resetLocalizationSubscribers() {
        this.subscriptions?.forEach(s => s.dispose());
      }
    }
    return localeMixin as Constructor<LitLocalizationMixin> & T;
  });

export function litLocale<T extends Constructor<LitElement>>(superClass: T) {
  return litLocaleMixin<T>(localizerFactory)(superClass) as Constructor<LitLocalizationMixin> & T;
}
