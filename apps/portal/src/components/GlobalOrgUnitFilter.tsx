'use client'

import { useSearchParams } from 'next/navigation'
import { OrgUnitConfig } from '@packages/shared/schemas'
import { Stack, TextInput, Tooltip } from '@mantine/core'
import { useBoolean } from 'usehooks-ts'
import { useTranslations } from 'next-intl'
import { useMemo, useTransition } from 'react'
import { useOrgUnit } from '@/utils/orgUnits'
import { OrganisationUnit } from '@hisptz/dhis2-utils'
import { IconMapPin } from '@tabler/icons-react'
import { useRouter } from 'nextjs-toploader/app'
import { CustomOrgUnitModal } from '@/components/displayItems/visualizations/CustomOrgUnitModal'

export function GlobalOrgUnitFilter({
    orgUnitConfig,
    title,
    isPending,
}: {
    orgUnitConfig?: OrgUnitConfig
    title: string
    isPending: boolean
}) {
    const [isPendingOrgUnit, startOrgUnitTransition] = useTransition()
    const t = useTranslations('visualization')
    const tCommon = useTranslations('common')
    const searchParams = useSearchParams()
    const orgUnits = useMemo(
        () => searchParams.get('ou')?.split(',') ?? [],
        [searchParams.get('ou')]
    )
    const { loading, orgUnit } = useOrgUnit(orgUnits)
    const router = useRouter()
    const { value: hide, setTrue: onClose, setFalse: onOpen } = useBoolean(true)

    const onUpdate = (value: string[] | undefined) => {
        const updateSearchParams = new URLSearchParams(searchParams)
        updateSearchParams.set('ou', value?.join(',') ?? '')
        startOrgUnitTransition(() => {
            router.replace(`?${updateSearchParams.toString()}`)
        })
    }

    const hasActiveParams = !!searchParams.get('ou')

    const onReset = () => {
        const params = new URLSearchParams(searchParams)
        params.delete('ou')
        startOrgUnitTransition(() => {
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
                        label={t('clickToChangeLocation')}
                    >
                        <TextInput
                            onClick={onOpen}
                            readOnly
                            label={t('location')}
                            disabled={isPending || isPendingOrgUnit || loading}
                            rightSection={<IconMapPin size={16} />}
                            value={
                                isPending || isPendingOrgUnit
                                    ? tCommon('pleaseWait')
                                    : loading
                                      ? tCommon('loading')
                                      : orgUnit
                                            ?.map(
                                                (ou: OrganisationUnit) =>
                                                    ou.name ?? ou.displayName
                                            )
                                            .join(tCommon('listSeparator'))
                            }
                        />
                    </Tooltip>
                </div>
            </Stack>
            {!hide && (
                <CustomOrgUnitModal
                    onReset={hasActiveParams ? onReset : () => {}}
                    orgUnitState={orgUnits}
                    onUpdate={onUpdate}
                    open={!hide}
                    title={title}
                    handleClose={onClose}
                    limitSelectionToLevels={orgUnitConfig?.orgUnitLevels}
                    orgUnitsId={orgUnitConfig?.orgUnits}
                    singleSelection={orgUnitConfig?.singleSelection}
                />
            )}
        </>
    )
}
