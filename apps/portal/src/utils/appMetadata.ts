import { unstable_rethrow } from 'next/navigation'
import { getAppConfigWithNamespace } from '@/utils/config'
import { DatastoreNamespaces } from '@packages/shared/constants'
import { AppMeta } from '@packages/shared/schemas'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { localizeContent } from '@/utils/i18n/content'

export async function getDefaultMetadata(): Promise<Metadata> {
    const t = await getTranslations('metadata')
    return {
        title: t('defaultTitle'),
        description: t('defaultDescription'),
    }
}

export async function getAppMetadata(): Promise<Metadata> {
    try {
        const config = await getAppMeta()
        if (!config) {
            return await getDefaultMetadata()
        }

        return {
            applicationName: config?.name,
            title: {
                default: config?.name,
                template: `%s | ${config?.name}`,
            },
            description: config?.description,
        } as Metadata
    } catch (e) {
        unstable_rethrow(e)
        return await getDefaultMetadata()
    }
}

export async function getAppMeta(): Promise<AppMeta | undefined> {
    try {
        const config = await getAppConfigWithNamespace<AppMeta>({
            namespace: DatastoreNamespaces.MAIN_CONFIG,
            key: 'metadata',
        })
        return await localizeContent(config)
    } catch (e) {
        unstable_rethrow(e)
        return
    }
}
