import { DocumentsModuleConfig } from '@packages/shared/schemas'
import { Box, Group, Text } from '@mantine/core'
import { isEmpty } from 'lodash-es'
import { DocumentItemCard } from '@/components/modules/DocumentsModule/components/DocumentItemCard'
import { useTranslations } from 'next-intl'

export function DocumentsItemsContainer({
    config,
    searchParams,
}: {
    config: DocumentsModuleConfig
    searchParams: { group?: string }
}) {
    const t = useTranslations('emptyStates')
    if (!config.grouped) {
        if (isEmpty(config.items)) {
            return (
                <Box
                    flex={1}
                    className="w-full h-full flex flex-col items-center justify-center min-h-[400px]"
                >
                    <Text size="lg" c="dimmed">
                        {t('noItemsInModule')}
                    </Text>
                </Box>
            )
        }

        return (
            <Group wrap="wrap" flex={1}>
                {config.items.map((item) => (
                    <DocumentItemCard key={item.id} item={item} />
                ))}
            </Group>
        )
    }

    if (isEmpty(config.groups) && config.grouped) {
        return (
            <Box className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
                <Text size="lg" c="dimmed">
                    {t('noGroupsInModule')}
                </Text>
            </Box>
        )
    }

    const groupId = searchParams.group

    if (!groupId) {
        return (
            <Box
                flex={1}
                className="w-full h-full flex flex-col items-center justify-center min-h-[400px]"
            >
                <Text size="lg" c="dimmed">
                    {t('selectGroupForDocuments')}
                </Text>
            </Box>
        )
    }

    const group = config.groups.find((group) => group.id === groupId)

    if (!group) {
        return (
            <Box
                flex={1}
                className="w-full h-full flex flex-col items-center justify-center min-h-[400px]"
            >
                <Text size="lg" c="dimmed">
                    {t('groupNotFound', { groupId })}
                </Text>
            </Box>
        )
    }

    if (isEmpty(group.items)) {
        return (
            <Box
                flex={1}
                className="w-full h-full flex flex-col items-center justify-center min-h-[400px]"
            >
                <Text size="lg" c="dimmed">
                    {t('noItemsInGroup')}
                </Text>
            </Box>
        )
    }

    return (
        <Group wrap="wrap" flex={1}>
            {group.items.map((item) => (
                <DocumentItemCard key={item.id} item={item} />
            ))}
        </Group>
    )
}
