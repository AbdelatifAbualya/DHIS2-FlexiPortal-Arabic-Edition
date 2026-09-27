import { ReadonlyURLSearchParams } from 'next/navigation'
import { dhis2HttpClient } from '@/utils/api/dhis2'
import {
    ChartVisualizationItem,
    VisualizationConfig,
    visualizationFields,
} from '@packages/shared/schemas'
import { getAppearanceConfig } from '@/utils/config/appConfig'
import { DataVisualizationClient } from './DataVisualizationClient'
import { getTranslations } from 'next-intl/server'
import { getCurrentLocale } from '@/i18n/locale'
import { getDHIS2LocaleParams } from '@/utils/i18n/dhis2'

export interface MainVisualizationProps {
    searchParams?: ReadonlyURLSearchParams
    config: ChartVisualizationItem
    showFilter?: boolean
    disableActions?: boolean
}

export async function getDataVisualization(config: ChartVisualizationItem) {
    const { id } = config
    const locale = await getCurrentLocale()
    const visualizationConfig = await dhis2HttpClient.get<VisualizationConfig>(
        `visualizations/${id}`,
        {
            params: {
                fields: visualizationFields.join(','),
                ...getDHIS2LocaleParams(locale),
            },
        }
    )

    return {
        visualizationConfig: visualizationConfig
            ? {
                  ...visualizationConfig,
                  // The display name is translated by DHIS2 in the requested locale
                  name:
                      visualizationConfig.displayName ||
                      visualizationConfig.name,
              }
            : visualizationConfig,
    }
}

export async function DataVisualization({
    config,
    disableActions,
    showFilter,
}: MainVisualizationProps) {
    const { visualizationConfig } = await getDataVisualization(config)
    const { appearanceConfig } = (await getAppearanceConfig())!
    const colors = appearanceConfig.colors.chartColors

    if (!visualizationConfig) {
        console.error(
            `Could not get visualization details for visualization ${config.id}`
        )
        const t = await getTranslations('errors')
        throw Error(t('visualizationDetails'))
    }

    return (
        <DataVisualizationClient
            visualizationConfig={visualizationConfig}
            config={config}
            colors={colors}
            disableActions={disableActions}
            showFilter={showFilter}
        />
    )
}
