/*
 * Languages supported by the public portal.
 *
 * `en` is the source language: every text configured in the manager is written in English and
 * translated through the content translations dictionary (see `utils/translations.ts`).
 * */

export const SUPPORTED_LOCALES = ['en', 'ar'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const SOURCE_LOCALE: SupportedLocale = 'en'

export const DEFAULT_LOCALE: SupportedLocale = 'en'

export const RTL_LOCALES: ReadonlyArray<SupportedLocale> = ['ar']

/*
 * Cookie used by the portal to remember the language selected by a visitor.
 * */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
    en: 'English',
    ar: 'العربية',
}

/*
 * Short labels used where space is limited, e.g. the language switcher on small screens
 * */
export const LOCALE_SHORT_LABELS: Record<SupportedLocale, string> = {
    en: 'EN',
    ar: 'ع',
}

export function isSupportedLocale(value: unknown): value is SupportedLocale {
    return (
        typeof value === 'string' &&
        (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(value)
    )
}

export function getLocaleDirection(locale: SupportedLocale): 'rtl' | 'ltr' {
    return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'
}
