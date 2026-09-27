import { useBoolean, useResizeObserver } from 'usehooks-ts'
import { RefObject, useMemo, useRef, useState } from 'react'
import HighchartsReact from 'highcharts-react-official'
import { useTranslations } from 'next-intl'
import {
    IconChartBar,
    IconClock,
    IconDownload,
    IconMapPin,
    IconMaximize,
    IconMinimize,
    IconTable,
} from '@tabler/icons-react'
import { downloadExcelFromTable } from '@/utils/table'
import {
    VisualizationChartType,
    VisualizationConfig,
    VisualizationItem,
} from '@packages/shared/schemas'
import Highcharts from 'highcharts'
import { isEmpty } from 'lodash-es'
import { useFullScreenHandle } from 'react-full-screen'
import { ActionMenuGroup } from '@/components/displayItems/visualizations/ActionMenu'

export function useDimensionViewControls({
    visualizationConfig,
    chartRef,
    tableRef,
    config,
    showFilter,
}: {
    visualizationConfig: VisualizationConfig
    config: VisualizationItem
    chartRef: RefObject<HighchartsReact.RefObject | null>
    tableRef: RefObject<HTMLTableElement | null>
    showFilter?: boolean
}) {
    const handler = useFullScreenHandle()
    const t = useTranslations('visualization')
    const {
        value: showOrgUnitSelector,
        setTrue: onShowOrgUnitSelector,
        setFalse: onCloseOrgUnitSelector,
    } = useBoolean(false)

    const {
        value: showPeriodSelector,
        setTrue: onShowPeriodSelector,
        setFalse: onClosePeriodSelector,
    } = useBoolean(false)
    const { value: showTable, toggle: toggleShowTable } = useBoolean(false)

    const onDownload = () => {
        const { type } = config
        console.log(`Printing ${type} visualization`)
        const label = `${visualizationConfig.name.toLowerCase()}`
        if (
            showTable ||
            visualizationConfig.type === VisualizationChartType.TABLE
        ) {
            downloadExcelFromTable(tableRef.current!, label)
            return
        } else {
            ;(
                chartRef.current
                    ?.chart as unknown as HighchartsReact.RefObject & {
                    exportChart: (
                        options: Highcharts.ExportingOptions,
                        chartOptions: Highcharts.Options
                    ) => void
                }
            )?.exportChart(
                {
                    filename: label,
                },
                {
                    title: {
                        text: visualizationConfig.name,
                    },
                }
            )
        }
    }

    const canShowTable = useMemo(
        () =>
            !isEmpty(visualizationConfig.rows) &&
            !isEmpty(visualizationConfig.columns),
        [visualizationConfig.rows, visualizationConfig.columns]
    )

    const onFullScreen = () => {
        if (handler.active) {
            handler.exit()
            chartRef.current!.chart.redraw()
        } else {
            handler.enter()
            chartRef.current!.chart.redraw()
        }
    }

    const actionMenuGroups: ActionMenuGroup[] = useMemo(() => {
        const menus: ActionMenuGroup[] = [
            {
                actions: [
                    {
                        label: t('download'),
                        onClick: onDownload,
                        icon: <IconDownload />,
                    },
                ],
            },
        ]

        if (showFilter) {
            menus.unshift({
                label: t('filters'),
                actions: [
                    {
                        label: t('location'),
                        icon: <IconMapPin />,
                        onClick: onShowOrgUnitSelector,
                    },
                    {
                        label: t('period'),
                        icon: <IconClock />,
                        onClick: onShowPeriodSelector,
                    },
                ],
            })
        }

        const viewMenu: ActionMenuGroup = canShowTable
            ? {
                  label: t('view'),
                  actions: [
                      {
                          label: showTable ? t('showChart') : t('showTable'),
                          icon: showTable ? <IconChartBar /> : <IconTable />,
                          onClick: toggleShowTable,
                      },
                      {
                          label: t('fullPage'),
                          icon: handler.active ? (
                              <IconMinimize />
                          ) : (
                              <IconMaximize />
                          ),
                          onClick: onFullScreen,
                      },
                  ],
              }
            : {
                  label: t('view'),
                  actions: [
                      {
                          label: t('fullPage'),
                          icon: handler.active ? (
                              <IconMinimize />
                          ) : (
                              <IconMaximize />
                          ),
                          onClick: onFullScreen,
                      },
                  ],
              }

        return [viewMenu, ...menus]
    }, [
        onShowOrgUnitSelector,
        onShowPeriodSelector,
        onDownload,
        canShowTable,
        showTable,
        t,
        toggleShowTable,
        handler.active,
        onFullScreen,
        showFilter,
    ])

    return {
        handler,
        showTable,
        onFullScreen,
        showOrgUnitSelector,
        showPeriodSelector,
        actionMenuGroups,
        onShowOrgUnitSelector,
        onShowPeriodSelector,
        onCloseOrgUnitSelector,
        onClosePeriodSelector,
    }
}

export function useContainerSize(
    chartRef: RefObject<HighchartsReact.RefObject | null>
) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    useResizeObserver({
        ref: containerRef as RefObject<HTMLDivElement>,
        onResize: ({ width, height }) => {
            if (chartRef.current?.chart) {
                if (width && height) {
                    chartRef.current?.chart.setSize(width, height - 64, true)
                }
            }
        },
    })

    return {
        containerRef,
    }
}

export function useVisualizationRefs() {
    const chartRef = useRef<HighchartsReact.RefObject>(null)
    const tableRef = useRef<HTMLTableElement>(null)
    const [, setSingleValueRef] = useState<HTMLDivElement | null>(null)

    return {
        chartRef,
        tableRef,
        setSingleValueRef,
    }
}
