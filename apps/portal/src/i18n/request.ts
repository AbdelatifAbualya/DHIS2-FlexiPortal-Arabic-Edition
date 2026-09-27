import { getRequestConfig } from 'next-intl/server'
import { getCurrentLocale } from '@/i18n/locale'
import { getMessages } from '@/i18n/messages'

export default getRequestConfig(async () => {
    const locale = await getCurrentLocale()
    return {
        locale,
        messages: getMessages(locale),
    }
})
