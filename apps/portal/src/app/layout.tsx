import './globals.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import 'react-grid-layout/css/styles.css'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { getLocaleDirection } from '@packages/shared/constants'
import { getAppMetadata } from '@/utils/appMetadata'
import { DHIS2AppProvider } from '@/components/DHIS2AppProvider'
import { NavigationBar } from '@/components/NavigationBar'
import { Providers } from '@/components/Providers'
import { getAppearanceConfig } from '@/utils/config/appConfig'
import { env } from '@/utils/env'
import { dhis2HttpClient } from '@/utils/api/dhis2'
import { DHIS2ConnectionError } from '@/components/DHIS2ConnectionError'
import { arabicFont } from '@/fonts/arabic'

export async function generateMetadata() {
    return await getAppMetadata()
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const locale = await getLocale()
    const dir = getLocaleDirection(locale)
    const connectionStatus = await dhis2HttpClient.verifyClient()

    if (connectionStatus.status !== 'OK') {
        return (
            <NextIntlClientProvider>
                <DHIS2ConnectionError
                    error={connectionStatus}
                    locale={locale}
                    fontClassName={arabicFont.variable}
                />
            </NextIntlClientProvider>
        )
    }
    const config = await getAppearanceConfig()
    const contextPath = env.NEXT_PUBLIC_CONTEXT_PATH ?? ''

    return (
        <html
            lang={locale}
            dir={dir}
            className={arabicFont.variable}
            {...mantineHtmlProps}
        >
            <head>
                <ColorSchemeScript />
            </head>
            <body suppressHydrationWarning>
                <NextIntlClientProvider>
                    <Providers
                        config={config?.appearanceConfig}
                        locale={locale}
                    >
                        <NavigationBar config={config} />
                        <DHIS2AppProvider contextPath={contextPath}>
                            {children}
                        </DHIS2AppProvider>
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
