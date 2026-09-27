import { merge } from 'lodash-es'
import { SOURCE_LOCALE, SupportedLocale } from '@packages/shared/constants'
import en from '../../messages/en.json'
import ar from '../../messages/ar.json'

export type Messages = typeof en

const messages: Record<SupportedLocale, Partial<Messages>> = {
    en,
    ar,
}

const mergedMessages = new Map<SupportedLocale, Messages>()

/*
 * Messages of the given locale. Any message missing in the locale falls back to the source (English) message.
 * */
export function getMessages(locale: SupportedLocale): Messages {
    if (locale === SOURCE_LOCALE) {
        return messages[SOURCE_LOCALE] as Messages
    }
    let localeMessages = mergedMessages.get(locale)
    if (!localeMessages) {
        localeMessages = merge(
            {},
            messages[SOURCE_LOCALE],
            messages[locale]
        ) as Messages
        mergedMessages.set(locale, localeMessages)
    }
    return localeMessages
}
