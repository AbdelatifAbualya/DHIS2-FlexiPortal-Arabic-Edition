import { unstable_rethrow } from 'next/navigation'
import { cache } from 'react'
import {
    DatastoreKeys,
    DatastoreNamespaces,
    SOURCE_LOCALE,
    SupportedLocale,
} from '@packages/shared/constants'
import {
    contentTranslationsConfigSchema,
    TranslationDictionary,
} from '@packages/shared/schemas'
import {
    getTranslationDictionary,
    translateConfig,
} from '@packages/shared/utils'
import { dhis2HttpClient } from '@/utils/api/dhis2'
import { getCurrentLocale } from '@/i18n/locale'

/*
 * Translations of the manager configured texts for the given locale. Fetched once per request.
 * */
export const getContentTranslationDictionary = cache(
    async (locale: SupportedLocale): Promise<TranslationDictionary> => {
        if (locale === SOURCE_LOCALE) {
            return {}
        }
        try {
            const config = await dhis2HttpClient.get<unknown>(
                `dataStore/${DatastoreNamespaces.MAIN_CONFIG}/${DatastoreKeys.TRANSLATIONS}`,
                { ignoreNotFound: true }
            )
            if (!config) {
                return {}
            }
            const parsed = contentTranslationsConfigSchema.safeParse(config)
            if (!parsed.success) {
                console.error(
                    'Invalid content translations configuration, translations are ignored',
                    parsed.error
                )
                return {}
            }
            return getTranslationDictionary(parsed.data, locale)
        } catch (e) {
            unstable_rethrow(e)
            console.error('Could not get content translations', e)
            return {}
        }
    }
)

/*
 * Translates the manager configured texts of a configuration to the language of the current request.
 * */
export async function localizeContent<T>(value: T): Promise<T> {
    if (value === undefined || value === null) {
        return value
    }
    const locale = await getCurrentLocale()
    const dictionary = await getContentTranslationDictionary(locale)
    return translateConfig(value, dictionary)
}
