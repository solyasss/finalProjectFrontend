import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import uk from './locales/uk.json'

export type AppLocale = 'uk' | 'en'

const DEFAULT_LOCALE: AppLocale = 'uk'

function getSavedLocale(): AppLocale {
  if (typeof globalThis.localStorage === 'undefined') {
    return DEFAULT_LOCALE
  }

  const locale = globalThis.localStorage.getItem('locale')
  return locale === 'en' || locale === 'uk' ? locale : DEFAULT_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  globalInjection: true,
  messages: { en, uk },
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    },
    uk: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    },
  },
})
