import { getAppConfigWithNamespace } from '@/utils/config'
import { DatastoreNamespaces } from '@packages/shared/constants'
import { AppModule } from '@packages/shared/schemas'
import { localizeContent } from '@/utils/i18n/content'

export async function getAppModule(key: string) {
    const moduleConfig = await getAppConfigWithNamespace<AppModule>({
        namespace: DatastoreNamespaces.MODULES,
        key,
    })
    return await localizeContent(moduleConfig)
}
