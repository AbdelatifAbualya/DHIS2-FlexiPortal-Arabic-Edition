'use client'
import { useTranslations } from 'next-intl'
import { Button } from '@mantine/core'
import { useRouter, useSearchParams } from 'next/navigation'
import { TransitionStartFunction } from 'react'

export function ResetDimensionButton({
    isPending,
    startTransition,
}: {
    isPending: boolean
    startTransition: TransitionStartFunction
}) {
    const t = useTranslations('visualization')
    const router = useRouter()
    const searchParams = useSearchParams()

    const hasActiveParams = !!searchParams.get('ou') || !!searchParams.get('pe')

    if (!hasActiveParams) {
        return null
    }

    const onReset = () => {
        const params = new URLSearchParams(searchParams)
        params.delete('ou')
        params.delete('pe')
        startTransition(() => {
            router.replace(`?${params.toString()}`)
        })
    }

    return (
        <Button disabled={isPending} variant={'subtle'} onClick={onReset}>
            {t('resetFilters')}
        </Button>
    )
}
