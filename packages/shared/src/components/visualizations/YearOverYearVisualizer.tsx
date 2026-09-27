import {
    AnalyticsData,
    VisualizationChartType,
    YearOverYearVisualizationConfig,
} from '../../schemas'
import { RefObject, useMemo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { PeriodUtility } from '@hisptz/dhis2-utils'
import { isEmpty, uniq } from 'lodash-es'

export interface YearOverYearChartVisualizerProps {
    analytics?: Map<string, AnalyticsData>
    visualization: YearOverYearVisualizationConfig
    colors: string[]
    setRef: RefObject<HighchartsReact.RefObject | null>
    /*
     * Returns the display name of a period. Defaults to the English name of the period.
     * */
    getPeriodName?: (periodId: string) => string
}

function getDefaultPeriodName(periodId: string) {
    return PeriodUtility.getPeriodById(periodId).name
}

export function YearOverYearVisualizer({
    analytics,
    visualization,
    colors,
    setRef,
    getPeriodName = getDefaultPeriodName,
}: YearOverYearChartVisualizerProps) {
    const series: Highcharts.SeriesOptionsType[] = useMemo(() => {
        if (!analytics) {
            return []
        }
        return Array.from(analytics.entries()).map(([key, value]) => {
            const rows = value.rows
            const valueIndex = value.headers.findIndex(
                ({ name }) => name === 'value'
            )
            const categories = value.metaData?.dimensions?.pe ?? []
            return {
                name: getPeriodName(key),
                data: categories.map((category) => {
                    const row = rows.find((row) => row.includes(category))

                    if (!row) {
                        return null
                    }

                    return parseFloat(row[valueIndex]!)
                }),
            } as Highcharts.SeriesOptionsType
        })
    }, [analytics, getPeriodName])

    const categories = useMemo(() => {
        if (!analytics) {
            return []
        }
        const allCategories = Array.from(analytics.values())
            .map((value) => value.metaData?.dimensions?.pe ?? [])
            .flat()
        return uniq(allCategories).map(
            (category) => getPeriodName(category).replace(/\d{4}/, '').trim() //A hack to remove years from periods.
        )
    }, [analytics, getPeriodName])

    const options: Highcharts.Options = useMemo(() => {
        const chartType =
            visualization?.type === VisualizationChartType.YEAR_OVER_YEAR_LINE
                ? 'line'
                : 'column'
        return {
            chart: { type: chartType },
            title: {
                text: isEmpty(visualization?.filters)
                    ? ''
                    : visualization.filters
                          ?.map((filter) =>
                              filter.items
                                  .map((item) => item.displayName)
                                  .join(', ')
                          )
                          .join(', '),
            },
            xAxis: { categories, title: { text: '' } },
            yAxis: { title: { text: '' } },
            series,
            legend: { enabled: true },
            tooltip: { shared: true },
            credits: { enabled: false },
            exporting: {
                sourceWidth: 1200,
                buttons: {
                    contextButton: {
                        enabled: false,
                    },
                },
            },
            colors,
        }
    }, [series, categories])

    return (
        <div style={{ width: '100%', height: `100%` }}>
            <HighchartsReact
                allowChartUpdate
                containerProps={{ style: { height: '100%' } }}
                highcharts={Highcharts}
                options={options}
                ref={setRef}
            />
        </div>
    )
}
