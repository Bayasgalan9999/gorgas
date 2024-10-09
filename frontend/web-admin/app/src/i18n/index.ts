import { nextTick } from 'vue';
import { createI18n, useI18n, type I18nOptions } from 'vue-i18n';

import type { I18n } from 'vue-i18n';
import type enUS from './locales/en-US.json';

export const SUPPORTED_LOCALES = ['mn-MN', 'en-US', 'ru-RU'] as const;

export type MessageSchema = typeof enUS;
export type Locale = typeof SUPPORTED_LOCALES[number];

const navigatorLang = navigator.language as Locale;
const defaultLocale = SUPPORTED_LOCALES.includes(navigatorLang)
  ? navigatorLang
  : 'en-US'; //TODO swap to 'mn-MN' in prod?

export const useAppI18n = () => useI18n<{ message: MessageSchema }>();

let i18n: I18n<any, any, any, any, false>;

export function setupI18n() {
  let locale = window.localStorage.getItem('locale') as Locale;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    locale = defaultLocale;
  }

  i18n = createI18n<[MessageSchema], Locale, false>({
    legacy: false,
    locale: locale,
    fallbackLocale: 'en',
  });

  setI18nLanguage(locale);
  loadLocaleMessages(locale);

  return i18n;
}

export function setI18nLanguage(locale: Locale) {
  window.localStorage.setItem('locale', locale);
  i18n.global.locale.value = locale;
}

export async function loadLocaleMessages(locale: Locale) {
  const messages = (await import(`./locales/${locale}.json`)) as MessageSchema;
  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages);

  return nextTick();
}
