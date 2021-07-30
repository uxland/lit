import {localeMixin, localizerFactory, LocalizerFactory} from '@uxland/localization';
import {Constructor} from '@uxland/utilities/dedupe-mixin';
import {LitElement} from 'lit';

export const litLocaleMixin =
  <T extends Constructor<LitElement | any>>(factory: LocalizerFactory) =>
  (superClass: T) => {
    return localeMixin(factory)(superClass) as Constructor<LitElement> & T;
  };

export const litLocale = litLocaleMixin(localizerFactory);
