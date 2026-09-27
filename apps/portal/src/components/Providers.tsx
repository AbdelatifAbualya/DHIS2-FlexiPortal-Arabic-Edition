'use client'
import { AppAppearanceConfig } from '@packages/shared/schemas'
import { getLocaleDirection, SupportedLocale } from '@packages/shared/constants'
import { getAppTheme } from '@/utils/theme'
import { DirectionProvider, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import { ModalsProvider } from '@mantine/modals'
import { syncLibraryLocale } from '@/i18n/library'

export function Providers({
    config,
    locale,
    children,
}: {
    config?: AppAppearanceConfig
    locale: SupportedLocale
    children: React.ReactNode
}) {
    const theme = getAppTheme(config)

    // Runs before any visualization library renders, so that they display their texts in the selected language
    syncLibraryLocale(locale)

    return (
        <DirectionProvider
            initialDirection={getLocaleDirection(locale)}
            detectDirection={false}
        >
            <MantineProvider theme={theme}>
                <Notifications />
                <ModalsProvider>{children}</ModalsProvider>
            </MantineProvider>
        </DirectionProvider>
    )
}
