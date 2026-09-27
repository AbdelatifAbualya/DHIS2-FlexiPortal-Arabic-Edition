'use client'

import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { useTranslations } from 'next-intl'

export default function ModuleError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    console.error(error, reset)
    const t = useTranslations('common')

    return (
        <Center h="98dvh">
            <Stack align="center">
                <Title order={2}>{t('unexpectedError')}</Title>
                <Text ta="center" c="dimmed">
                    {error.message}
                </Text>
                <Button onClick={reset}>{t('refresh')}</Button>
            </Stack>
        </Center>
    )
}
