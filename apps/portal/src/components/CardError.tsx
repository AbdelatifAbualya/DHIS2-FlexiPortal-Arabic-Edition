'use client'

import {
    Button,
    Container,
    Stack,
    Text,
    Title,
    useMantineTheme,
} from '@mantine/core'
import { IconExclamationCircleFilled } from '@tabler/icons-react'
import { FallbackProps } from 'react-error-boundary'
import { useTranslations } from 'next-intl'

export function BaseCardError({ error }: { error: Error }) {
    const theme = useMantineTheme()
    const t = useTranslations('common')
    return (
        <Container
            className="w-full h-full flex flex-col justify-center items-center"
            fluid
        >
            <Stack gap="sm" align="center">
                <IconExclamationCircleFilled
                    color={theme.colors[theme.primaryColor]![5]}
                    opacity={0.4}
                    size={36}
                />
                <Stack align="center" gap={0}>
                    <Title order={4}>{t('somethingWentWrong')}</Title>
                    <Text c="dimmed">{error.message ?? error.toString()}</Text>
                </Stack>
            </Stack>
        </Container>
    )
}

export function CardError({ error, resetErrorBoundary }: FallbackProps) {
    const theme = useMantineTheme()
    const t = useTranslations('common')
    return (
        <Container
            className="w-full h-full flex flex-col justify-center items-center"
            fluid
        >
            <Stack gap="sm" align="center">
                <IconExclamationCircleFilled
                    color={theme.colors[theme.primaryColor]![5]}
                    opacity={0.4}
                    size={36}
                />
                <Stack align="center" gap={0}>
                    <Title order={4}>{t('somethingWentWrong')}</Title>
                    <Text c="dimmed">{error.message ?? error.toString()}</Text>
                </Stack>
                <Button onClick={resetErrorBoundary}>{t('retry')}</Button>
            </Stack>
        </Container>
    )
}
