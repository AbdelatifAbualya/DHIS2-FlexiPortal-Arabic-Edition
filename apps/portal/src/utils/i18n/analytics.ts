import { SOURCE_LOCALE } from '@packages/shared/constants'
import type { Messages } from '@/i18n/messages'
import { getPeriodLabel, PeriodMessages } from '@/utils/i18n/periods'

type AnalyticsLike = {
    headers?: Array<
        { name?: string; column?: string } & Record<string, unknown>
    >
    metaData?: {
        items?: Record<string, { name?: string } & Record<string, unknown>>
        dimensions?: Record<string, string[] | undefined>
    }
} & Record<string, unknown>

export type AnalyticsMessages = PeriodMessages & Pick<Messages, 'dimensions'>

const DIMENSION_IDS = ['dx', 'pe', 'ou', 'co'] as const

/*
 * DHIS2 translates the names of metadata (data items, organisation units...) itself when a locale is requested.
 * Dimension and period names are however always returned in English, they are localized here.
 * */
export function localizeAnalytics<T>(
    response: T,
    { locale, messages }: { locale: string; messages: AnalyticsMessages }
): T {
    if (locale === SOURCE_LOCALE) {
        return response
    }
    const analytics = response as AnalyticsLike
    if (!analytics || typeof analytics !== 'object') {
        return response
    }

    const dimensionNames: Record<string, string> = messages.dimensions

    const headers = Array.isArray(analytics.headers)
        ? analytics.headers.map((header) => {
              const name = header?.name
              if (
                  name &&
                  Object.prototype.hasOwnProperty.call(dimensionNames, name)
              ) {
                  return { ...header, column: dimensionNames[name] }
              }
              return header
          })
        : analytics.headers

    const items = analytics.metaData?.items
    if (!items || typeof items !== 'object') {
        return { ...analytics, headers } as T
    }

    const periodIds = new Set(analytics.metaData?.dimensions?.pe ?? [])
    const relativePeriodNames: Record<string, string> = messages.relativePeriods
    const localizedItems: typeof items = {}

    for (const [id, item] of Object.entries(items)) {
        if (!item || typeof item !== 'object') {
            localizedItems[id] = item
            continue
        }
        if ((DIMENSION_IDS as ReadonlyArray<string>).includes(id)) {
            localizedItems[id] = {
                ...item,
                name: dimensionNames[id] ?? item.name,
            }
        } else if (
            periodIds.has(id) ||
            Object.prototype.hasOwnProperty.call(relativePeriodNames, id)
        ) {
            localizedItems[id] = {
                ...item,
                name: getPeriodLabel(id, {
                    locale,
                    messages,
                    fallback: item.name,
                }),
            }
        } else {
            localizedItems[id] = item
        }
    }

    return {
        ...analytics,
        headers,
        metaData: { ...analytics.metaData, items: localizedItems },
    } as T
}
