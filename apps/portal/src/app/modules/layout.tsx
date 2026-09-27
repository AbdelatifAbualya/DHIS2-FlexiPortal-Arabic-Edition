import { MainLayout } from '@/components/MainLayout'
import { NoConfigLandingPage } from '@/components/NoConfigLandingPage'
import { getAppearanceConfig } from '@/utils/config/appConfig'

import { getAppMeta } from '@/utils/appMetadata'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const config = await getAppearanceConfig()
    const appMeta = await getAppMeta()

    if (!config) {
        return <NoConfigLandingPage />
    }

    const { appearanceConfig, menuConfig } = config
    return (
        <MainLayout
            metadata={appMeta!}
            menuConfig={menuConfig}
            appearanceConfig={appearanceConfig}
        >
            {children}
        </MainLayout>
    )
}
