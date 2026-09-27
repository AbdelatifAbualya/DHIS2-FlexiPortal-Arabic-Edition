import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import { SOURCE_LOCALE } from '@packages/shared/constants'
import type { Messages } from '@/i18n/messages'

export type PeriodMessages = Pick<
    Messages,
    | 'relativePeriods'
    | 'periodLabels'
    | 'relativePeriodTypes'
    | 'fixedPeriodTypes'
    | 'periodCategories'
>

export interface PeriodLabelOptions {
    locale: string
    messages: PeriodMessages
    /*
     * Name to use when the period cannot be resolved, e.g. the name returned by DHIS2
     * */
    fallback?: string
}

function getMessage(
    dictionary: Record<string, string> | undefined,
    key: string
): string | undefined {
    if (!dictionary || !Object.prototype.hasOwnProperty.call(dictionary, key)) {
        return undefined
    }
    const value = dictionary[key]
    return typeof value === 'string' && value.trim() ? value : undefined
}

export function localizeFixedPeriodName(
    name: string,
    locale: string,
    messages: PeriodMessages
): string {
    if (locale === SOURCE_LOCALE) {
        return name
    }
    // Weekly and bi-weekly period names are not localized by the calendar library
    return name
        .replace(/^Bi-Week (\d+)/, (_, number: string) =>
            messages.periodLabels.biWeek.replace('{number}', number)
        )
        .replace(/^Week (\d+)/, (_, number: string) =>
            messages.periodLabels.week.replace('{number}', number)
        )
}

/*
 * Display name of a DHIS2 period id (fixed like `202509`, `2025Q1` or relative like `LAST_12_MONTHS`) in the given locale.
 * */
export function getPeriodLabel(
    periodId: string,
    { locale, messages, fallback }: PeriodLabelOptions
): string {
    const relativePeriodName = getMessage(messages.relativePeriods, periodId)
    if (relativePeriodName) {
        return relativePeriodName
    }
    if (/^\d{4}$/.test(periodId)) {
        return periodId
    }
    try {
        const period = createFixedPeriodFromPeriodId({
            periodId,
            calendar: 'gregory',
            locale,
        })
        if (period?.displayName) {
            return localizeFixedPeriodName(period.displayName, locale, messages)
        }
    } catch {
        // Not a fixed period supported by the calendar library
    }
    return fallback ?? periodId
}

export function getPeriodTypeLabel(
    periodTypeId: string,
    category: 'RELATIVE' | 'FIXED',
    { messages, fallback }: Omit<PeriodLabelOptions, 'locale'>
): string {
    const dictionary =
        category === 'RELATIVE'
            ? messages.relativePeriodTypes
            : messages.fixedPeriodTypes
    return getMessage(dictionary, periodTypeId) ?? fallback ?? periodTypeId
}

export function getPeriodCategoryLabel(
    category: string,
    { messages }: Pick<PeriodLabelOptions, 'messages'>
): string {
    return getMessage(messages.periodCategories, category) ?? category
}
