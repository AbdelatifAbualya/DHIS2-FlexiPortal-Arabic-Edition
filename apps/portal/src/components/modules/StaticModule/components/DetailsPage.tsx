import { Card, Container, Stack, Title } from '@mantine/core'
import { getAppModule } from '@/utils/module'
import { ModuleType, StaticItemConfig } from '@packages/shared/schemas'
import { getAppConfigWithNamespace } from '@/utils/config'
import { DatastoreNamespaces } from '@packages/shared/constants'
import { BaseCardError } from '@/components/CardError'
import { RichContent } from '@/components/RichContent'
import { BackButton } from '@/components/modules/StaticModule/components/BackButton'
import { localizeContent } from '@/utils/i18n/content'
import { getTranslations } from 'next-intl/server'

export async function DetailsPage({
    id,
    moduleId,
}: {
    id: string
    moduleId: string
}) {
    const t = await getTranslations('errors')
    const config = await getAppModule(moduleId)

    if (!config || config.type !== ModuleType.STATIC) {
        return <BaseCardError error={new Error(t('couldNotDetermineShort'))} />
    }

    const namespace = config.config.namespace

    const item = await localizeContent(
        await getAppConfigWithNamespace<StaticItemConfig>({
            namespace: namespace as DatastoreNamespaces,
            key: id,
        })
    )

    if (!item) {
        return <BaseCardError error={new Error(t('itemNotFound'))} />
    }

    return (
        <Container fluid px={0}>
            <Stack align="flex-start">
                <BackButton href="../" />
                <Title order={2}>{item.title}</Title>
                <Card>
                    <RichContent content={item.content} />
                </Card>
            </Stack>
        </Container>
    )
}
