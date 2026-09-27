import { cookies } from 'next/headers'
import {
    DEFAULT_LOCALE,
    isSupportedLocale,
    LOCALE_COOKIE_NAME,
    SupportedLocale,
} from '@packages/shared/constants'
import { env } from '@/utils/env'

/*
 * The language used when a visitor has not selected one yet. Can be set with the `DEFAULT_LOCALE` environment variable.
 * */
export function getDefaultLocale(): SupportedLocale {
    return isSupportedLocale(env.DEFAULT_LOCALE)
        ? env.DEFAULT_LOCALE
        : DEFAULT_LOCALE
}

/*
 * The language of the current request, from the visitor's language cookie.
 * */
export async function getCurrentLocale(): Promise<SupportedLocale> {
    const cookieStore = await cookies()
    const value = cookieStore.get(LOCALE_COOKIE_NAME)?.value
    return isSupportedLocale(value) ? value : getDefaultLocale()
}
