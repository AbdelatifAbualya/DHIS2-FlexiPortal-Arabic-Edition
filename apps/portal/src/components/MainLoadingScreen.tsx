import { Center, Flex, Image, Loader, Stack, Text, Title } from '@mantine/core'
import NextImage from 'next/image'
import { NoConfigLandingPage } from '@/components/NoConfigLandingPage'
import { getAppearanceConfig } from '@/utils/config/appConfig'
import { Providers } from '@/components/Providers'
import { getAppMeta } from '@/utils/appMetadata'
import { getServerImageUrl } from '@/utils/server/images'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function MainLoadingScreen() {
    const config = await getAppearanceConfig()
    const appMeta = await getAppMeta()
    const locale = await getLocale()
    const t = await getTranslations('layout')
    const logo = appMeta?.icon ? getServerImageUrl(appMeta?.icon) : undefined

    if (!config) {
        return <NoConfigLandingPage />
    }

    const { appearanceConfig } = config

    return (
        <Providers config={appearanceConfig} locale={locale}>
            <div className="h-screen w-screen">
                <Flex h="100%" direction="column" justify="space-between">
                    <Center flex={1}>
                        <Stack p="sm" align="center">
                            <div className="w-[80px] h-[80px] items-center justify-center flex">
                                {logo && (
                                    <Image
                                        width={80}
                                        height={80}
                                        style={{ width: 80, height: 80 }}
                                        component={NextImage}
                                        src={logo}
                                        alt={t('logo')}
                                    />
                                )}
                            </div>
                            <Loader size="sm" />
                            <Title
                                ta="center"
                                c={appearanceConfig.colors.primary}
                                order={3}
                            >
                                {appearanceConfig?.header?.title?.text}
                            </Title>
                        </Stack>
                    </Center>
                    <Text
                        fw={700}
                        c={appearanceConfig.colors.primary}
                        p="sm"
                        ta="center"
                    >
                        {t('poweredBy')}
                        <Text inherit href={'https://dhis.org'} component="a">
                            {' '}
                            DHIS2
                        </Text>
                    </Text>
                </Flex>
            </div>
        </Providers>
    )
}
