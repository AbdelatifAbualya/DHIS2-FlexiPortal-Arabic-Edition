'use client'

import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function BackButton({ href }: { href: string }) {
    const t = useTranslations('common')
    return (
        <Button
            component={Link}
            href={href}
            variant="subtle"
            leftSection={
                <IconArrowLeft size={14} className="rtl:-scale-x-100" />
            }
        >
            {t('back')}
        </Button>
    )
}
