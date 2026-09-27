import type { SupportedLocale } from '@packages/shared/constants'
import type en from '../../messages/en.json'

declare module 'next-intl' {
    interface AppConfig {
        Locale: SupportedLocale
        Messages: typeof en
    }
}
