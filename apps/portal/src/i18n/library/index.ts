import i18n from '@dhis2/d2-i18n'
import { SOURCE_LOCALE, SupportedLocale } from '@packages/shared/constants'
import { arLibraryTranslations } from './ar'

const LIBRARY_TRANSLATIONS: Partial<
    Record<SupportedLocale, Record<string, string>>
> = {
    ar: arLibraryTranslations,
}

/*
 * DHIS2 libraries translate with the default namespace of the app platform, or the i18next default one.
 * */
const NAMESPACES = ['translation', 'default']

let activeLocale: SupportedLocale | undefined

/*
 * Switches the language of the visualization libraries, which use the global @dhis2/d2-i18n (i18next) instance.
 *
 * This only runs in the browser: the libraries are rendered on the client only, and the i18next instance is a
 * singleton shared by all requests on the server, where it is kept in english.
 * */
export function syncLibraryLocale(locale: SupportedLocale) {
    if (typeof window === 'undefined' || activeLocale === locale) {
        return
    }
    const translations = LIBRARY_TRANSLATIONS[locale]
    if (translations) {
        for (const namespace of NAMESPACES) {
            i18n.addResourceBundle(locale, namespace, translations, true, true)
        }
    }
    i18n.changeLanguage(locale === SOURCE_LOCALE ? 'en' : locale)
    activeLocale = locale
}
