'use client'

import { Stack, TextInput, Tooltip } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { useBoolean } from 'usehooks-ts'

import { useMemo, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { PeriodConfig } from '@packages/shared/schemas'
import { IconClock } from '@tabler/icons-react'
import { usePeriodLabels } from '@/hooks/periods'
import { useRouter } from 'nextjs-toploader/app'
import { CustomPeriodModal } from '@/components/displayItems/visualizations/CustomPeriodModal'

export function GlobalPeriodFilter({
    periodConfig,
    title,
    isPending,
}: {
    periodConfig?: PeriodConfig
    title?: string
    isPending: boolean
}) {
    const [isPendingPeriod, startPeriodTransition] = useTransition()
    const router = useRouter()
    const searchParams = useSearchParams()
    const t = useTranslations('visualization')
    const tCommon = useTranslations('common')
    const { periodLabel } = usePeriodLabels()
    const { value: hide, setTrue: onClose, setFalse: onOpen } = useBoolean(true)
    const periods = useMemo(() => {
        return searchParams
            .get('pe')
            ?.split(',')
            ?.map((id: string) => {
                return { value: id, label: periodLabel(id) }
            })
    }, [searchParams, periodLabel])

    const onUpdate = (value: string[]) => {
        const updateSearchParams = new URLSearchParams(searchParams)
        updateSearchParams.set('pe', value.join(','))
        startPeriodTransition(() => {
            router.replace(`?${updateSearchParams.toString()}`)
        })
    }
    const hasActiveParams = !!searchParams.get('pe')

    const onReset = () => {
        const params = new URLSearchParams(searchParams)
        params.delete('pe')
        startPeriodTransition(() => {
            router.replace(`?${params.toString()}`)
        })
    }

    return (
        <>
            <Stack>
                <div className="w-full flex gap-2">
                    <Tooltip
                        withArrow
                        position={'bottom'}
                        label={t('clickToChangePeriod')}
                    >
                        <TextInput
                            label={t('period')}
                            disabled={isPending || isPendingPeriod}
                            readOnly
                            rightSection={<IconClock size={16} />}
                            value={
                                isPending || isPendingPeriod
                                    ? tCommon('pleaseWait')
                                    : (periods
                                          ?.map((pe) => pe.label)
                                          .join(tCommon('listSeparator')) ?? '')
                            }
                            onClick={onOpen}
                        />
                    </Tooltip>
                </div>
            </Stack>
            {!hide && (
                <CustomPeriodModal
                    {...(periodConfig ?? {})}
                    periodState={periods?.map((pe) => pe.value)}
                    open={!hide}
                    onReset={hasActiveParams ? onReset : () => {}}
                    handleClose={onClose}
                    onUpdate={onUpdate}
                    title={title ?? ''}
                />
            )}
        </>
    )
}
