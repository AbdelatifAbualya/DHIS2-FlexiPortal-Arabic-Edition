import { unstable_rethrow } from 'next/navigation'
import { getAppConfigWithNamespace } from '@/utils/config'
import { DatastoreNamespaces } from '@packages/shared/constants'
import { StaticItemConfig, StaticModule } from '@packages/shared/schemas'
import { Metadata } from 'next'
import { ModuleMetaProps } from '@/types/appMetadata'
import { last } from 'lodash-es'
import { getAppModule } from '@/utils/module'
import { localizeContent } from '@/utils/i18n/content'
import { getDefaultMetadata } from '@/utils/appMetadata'

export async function getModuleMetadata({
    props,
}: {
    props: ModuleMetaProps
}): Promise<Metadata> {
    try {
        const { module } = await props.params
        const searchParamsValue = await props.searchParams

        if (module.includes('details')) {
            //Details page
            const resourceId = last(module)!
            const moduleId = module.slice(-3, -2)[0]
            const moduleConfig = (await getAppModule(moduleId)) as StaticModule
            const namespace = moduleConfig.config.namespace

            const item = await localizeContent(
                await getAppConfigWithNamespace<StaticItemConfig>({
                    namespace: namespace as DatastoreNamespaces,
                    key: resourceId,
                })
            )

            if (!item) {
                return await getDefaultMetadata()
            }

            return {
                title: ` ${item.title} | ${moduleConfig.label}`,
                description: item.shortDescription,
            }
        }

        const moduleId = last(module)!
        const config = await getAppModule(moduleId)

        if (!config) {
            return await getDefaultMetadata()
        }

        const groupId: string | undefined = searchParamsValue?.group as
            | string
            | undefined

        if (groupId) {
            if ('groups' in config.config) {
                const groupConfig = config.config.groups?.find(
                    (group) => group.id === groupId
                ) as { title: string; shortDescription: string } | undefined
                if (groupConfig) {
                    return {
                        title: ` ${groupConfig.title} | ${config.label}`,
                        description: groupConfig.shortDescription,
                    }
                }
            }
        }

        return {
            title: `${config.label}`,
            description:
                'shortDescription' in config.config
                    ? `${config.config?.shortDescription}`
                    : undefined,
        }
    } catch (e) {
        unstable_rethrow(e)
        return await getDefaultMetadata()
    }
}
