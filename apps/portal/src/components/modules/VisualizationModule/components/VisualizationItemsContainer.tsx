import { VisualizationModuleConfig } from '@packages/shared/schemas'
import { FlexibleLayoutContainer } from '@/components/FlexibleLayoutContainer'
import { FlexibleLayoutItem } from '@/components/FlexibleLayoutItem'
import { Box, Text } from '@mantine/core'
import { isEmpty } from 'lodash-es'
import { DisplayItemContainer } from '@/components/displayItems/DisplayItemContainer'
import { DisplayItemSelector } from '@/components/displayItems/DisplayItemSelector'
import { useTranslations } from 'next-intl'

export function VisualizationItemsContainer({
    config,
    searchParams,
}: {
    config: VisualizationModuleConfig
    searchParams: { group?: string }
}) {
    const t = useTranslations('emptyStates')
    if (!config.grouped) {
        if (isEmpty(config.items)) {
            return (
                <Box className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
                    <Text size="lg" c="dimmed">
                        {t('noItemsInModule')}
                    </Text>
                </Box>
            )
        }
        return (
            <FlexibleLayoutContainer layouts={config.layouts}>
                {config.items.map((item) => (
                    <FlexibleLayoutItem
                        id={'item' in item ? item.item.id : ''}
                        key={'item' in item ? item.item.id : ''}
                    >
                        <DisplayItemContainer item={item}>
                            <DisplayItemSelector
                                item={item}
                                showFilter={config.showFilter}
                            />
                        </DisplayItemContainer>
                    </FlexibleLayoutItem>
                ))}
            </FlexibleLayoutContainer>
        )
    }

    const groupId = searchParams.group

    if (isEmpty(config.groups) && config.grouped) {
        return (
            <Box className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
                <Text size="lg" c="dimmed">
                    {t('noGroupsInModule')}
                </Text>
            </Box>
        )
    }

    if (!groupId) {
        return (
            <Box className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
                <Text size="lg" c="dimmed">
                    {t('selectGroupToVisualize')}
                </Text>
            </Box>
        )
    }

    const group = config.groups.find((group) => group.id === groupId)

    if (!group) {
        return (
            <Box className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
                <Text size="lg" c="dimmed">
                    {t('groupNotFound', { groupId })}
                </Text>
            </Box>
        )
    }

    if (isEmpty(group.items)) {
        return (
            <Box className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
                <Text size="lg" c="dimmed">
                    {t('noItemsInGroup')}
                </Text>
            </Box>
        )
    }

    return (
        <FlexibleLayoutContainer layouts={group.layouts}>
            {group.items.map((item) => (
                <FlexibleLayoutItem
                    id={'item' in item ? item.item.id : ''}
                    key={'item' in item ? item.item.id : ''}
                >
                    <DisplayItemContainer item={item}>
                        <DisplayItemSelector
                            showFilter={config.showFilter}
                            item={item}
                        />
                    </DisplayItemContainer>
                </FlexibleLayoutItem>
            ))}
        </FlexibleLayoutContainer>
    )
}
