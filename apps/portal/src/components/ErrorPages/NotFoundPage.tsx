'use client'

import { Illustration404 } from '@/components/ErrorPages/404Illustration'
import {
    Box,
    Button,
    Container,
    Group,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function NotFoundError() {
    const t = useTranslations('pages')
    return (
        <Container
            fluid
            className="h-screen flex flex-col justify-center items-center"
        >
            <Box className="w-[50%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <Illustration404
                    style={{
                        color: 'var(--mantine-color-gray-2)',
                    }}
                    className={`opacity-[0.75] `}
                />
            </Box>
            <Box className="w-[40%] z-10">
                <Stack align="center">
                    <Title>{t('notFoundTitle')}</Title>
                    <Text c="dimmed" size="lg" ta="center">
                        {t('notFoundMessage')}
                    </Text>
                    <Group justify="center">
                        <Button href={'/'} component={Link} size="md">
                            {t('notFoundAction')}
                        </Button>
                    </Group>
                </Stack>
            </Box>
        </Container>
    )
}
