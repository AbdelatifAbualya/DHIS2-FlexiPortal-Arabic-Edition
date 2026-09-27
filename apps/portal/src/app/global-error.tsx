'use client'
import './globals.css'
import '@mantine/core/styles.css'

import {
    Box,
    Button,
    ColorSchemeScript,
    Container,
    DirectionProvider,
    Group,
    mantineHtmlProps,
    MantineProvider,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import {
    DEFAULT_LOCALE,
    getLocaleDirection,
    isSupportedLocale,
    LOCALE_COOKIE_NAME,
    SupportedLocale,
} from '@packages/shared/constants'
import { getMessages } from '@/i18n/messages'

/*
 * This page replaces the root layout, so the locale is read from the language cookie in the browser.
 * */
function getBrowserLocale(): SupportedLocale {
    if (typeof document === 'undefined') {
        return DEFAULT_LOCALE
    }
    const value = document.cookie
        .split(';')
        .map((cookie) => cookie.trim().split('='))
        .find(([name]) => name === LOCALE_COOKIE_NAME)?.[1]
    return isSupportedLocale(value) ? value : DEFAULT_LOCALE
}

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE)
    const messages = getMessages(locale)
    const dir = getLocaleDirection(locale)

    useEffect(() => {
        console.error(error)
    }, [])

    useEffect(() => {
        setLocale(getBrowserLocale())
    }, [])

    return (
        <html lang={locale} dir={dir} {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <DirectionProvider
                    initialDirection={dir}
                    detectDirection={false}
                >
                    <MantineProvider>
                        <Notifications />
                        <Container
                            fluid
                            className="h-screen flex flex-col justify-center items-center"
                        >
                            <Box>
                                <Text
                                    fw={700}
                                    style={{
                                        fontSize: '16rem',
                                        margin: 0,
                                    }}
                                    className="opacity-40"
                                >
                                    500
                                </Text>
                            </Box>
                            <Box className="w-[40%] z-10">
                                <Stack align="center">
                                    <Title>
                                        {messages.pages.globalErrorTitle}
                                    </Title>
                                    <Text c="dimmed" size="lg" ta="center">
                                        {messages.pages.globalErrorMessage}
                                    </Text>
                                    <Group justify="center">
                                        <Button
                                            onClick={() => reset()}
                                            size="md"
                                        >
                                            {messages.common.refresh}
                                        </Button>
                                    </Group>
                                </Stack>
                            </Box>
                        </Container>
                    </MantineProvider>
                </DirectionProvider>
            </body>
        </html>
    )
}
