'use client'

import {
    Anchor,
    Button,
    Center,
    Container,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function NoConfigLandingPage() {
    const t = useTranslations('pages')
    const tCommon = useTranslations('common')
    return (
        <Container className="h-full" fluid>
            <Center h="100%">
                <Stack align="center">
                    <Title order={2}>{t('noConfigTitle')}</Title>
                    <Text ta="center" c="dimmed">
                        {t('noConfigMessage')}
                        <br />
                        {t('noConfigContact')}{' '}
                        <Anchor
                            component={Link}
                            target="_blank"
                            rel="noreferrer"
                            href={
                                'https://hisptz.github.io/dhis2-public-portal/docs/configuration/intro'
                            }
                        >
                            {t('documentation')}
                        </Anchor>
                    </Text>
                    <Button component={Link} href={'/'}>
                        {tCommon('refresh')}
                    </Button>
                </Stack>
            </Center>
        </Container>
    )
}
