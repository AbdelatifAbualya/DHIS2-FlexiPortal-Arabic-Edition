'use client'

import { Box, Button, Group } from '@mantine/core'
import { IconLanguage } from '@tabler/icons-react'
import { useLocale, useTranslations } from 'next-intl'
import {
    LOCALE_COOKIE_NAME,
    LOCALE_LABELS,
    LOCALE_SHORT_LABELS,
    SUPPORTED_LOCALES,
    SupportedLocale,
} from '@packages/shared/constants'

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

function saveLocale(locale: SupportedLocale) {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax${secure}`
}

export function LanguageSwitcher({ color }: { color?: string }) {
    const locale = useLocale()
    const t = useTranslations('language')
    const otherLocales = SUPPORTED_LOCALES.filter((value) => value !== locale)

    const onSelect = (value: SupportedLocale) => {
        saveLocale(value)
        // A full reload makes sure all server rendered content, cached data and the page direction are updated
        window.location.reload()
    }

    return (
        <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
            {otherLocales.map((value) => (
                <Button
                    key={value}
                    variant="subtle"
                    size="compact-sm"
                    c={color}
                    lang={value}
                    leftSection={<IconLanguage size={16} />}
                    aria-label={t('switchTo', {
                        language: LOCALE_LABELS[value],
                    })}
                    title={t('switchTo', { language: LOCALE_LABELS[value] })}
                    onClick={() => onSelect(value)}
                    data-test={`language-switcher-${value}`}
                >
                    <Box component="span" visibleFrom="sm">
                        {LOCALE_LABELS[value]}
                    </Box>
                    <Box component="span" hiddenFrom="sm">
                        {LOCALE_SHORT_LABELS[value]}
                    </Box>
                </Button>
            ))}
        </Group>
    )
}
