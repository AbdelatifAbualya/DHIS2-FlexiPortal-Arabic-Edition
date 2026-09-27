'use client'

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
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { getLocaleDirection, SupportedLocale } from '@packages/shared/constants'
import { ConnectionErrorCode, ConnectionErrorStatus } from '@/types/connection'
import { getAppTheme } from '@/utils/theme'

const errorMessageKeys = {
    INVALID_CREDENTIALS: {
        title: 'invalidCredentialsTitle',
        message: 'invalidCredentialsMessage',
    },
    INVALID_URL: { title: 'invalidUrlTitle', message: 'invalidUrlMessage' },
    INVALID_CONNECTION: {
        title: 'invalidConnectionTitle',
        message: 'invalidConnectionMessage',
    },
    UNKNOWN: { title: 'unknownTitle', message: 'unknownMessage' },
} as const satisfies Record<
    ConnectionErrorCode,
    { title: string; message: string }
>

export function DHIS2ConnectionError({
    error,
    locale,
    fontClassName,
}: {
    error: ConnectionErrorStatus
    locale: SupportedLocale
    fontClassName?: string
}) {
    const t = useTranslations()
    const dir = getLocaleDirection(locale)
    const keys = errorMessageKeys[error.code] ?? errorMessageKeys.UNKNOWN

    return (
        <html
            lang={locale}
            dir={dir}
            className={fontClassName}
            {...mantineHtmlProps}
        >
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <DirectionProvider
                    initialDirection={dir}
                    detectDirection={false}
                >
                    <MantineProvider theme={getAppTheme()}>
                        <Notifications />
                        <Container
                            fluid
                            className="h-screen flex flex-col justify-center items-center"
                        >
                            <Box className="w-[40%] z-10">
                                <Stack align="center">
                                    <Title>
                                        {t(`connection.${keys.title}`)}
                                    </Title>
                                    <Text c="dimmed" size="lg" ta="center">
                                        {t(`connection.${keys.message}`)}
                                    </Text>
                                    <Group justify="center">
                                        <Button
                                            component={Link}
                                            href={'/'}
                                            size="md"
                                        >
                                            {t('common.refresh')}
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
