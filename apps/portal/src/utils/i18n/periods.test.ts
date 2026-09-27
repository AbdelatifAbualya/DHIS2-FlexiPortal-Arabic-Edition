import { describe, expect, it } from 'vitest'
import { getMessages } from '@/i18n/messages'
import {
    getPeriodCategoryLabel,
    getPeriodLabel,
    getPeriodTypeLabel,
} from './periods'

const en = { locale: 'en', messages: getMessages('en') }
const ar = { locale: 'ar', messages: getMessages('ar') }

describe('getPeriodLabel', () => {
    it('keeps the DHIS2 english names in english', () => {
        expect(getPeriodLabel('202509', en)).toBe('September 2025')
        expect(getPeriodLabel('2025Q1', en)).toBe('January - March 2025')
        expect(getPeriodLabel('LAST_12_MONTHS', en)).toBe('Last 12 months')
        expect(getPeriodLabel('2025', en)).toBe('2025')
    })

    it('translates relative periods', () => {
        expect(getPeriodLabel('LAST_12_MONTHS', ar)).toBe('آخر 12 شهرًا')
        expect(getPeriodLabel('THIS_YEAR', ar)).toBe('هذه السنة')
    })

    it('translates fixed periods with latin digits', () => {
        expect(getPeriodLabel('202509', ar)).toBe('سبتمبر 2025')
        expect(getPeriodLabel('2025Q1', ar)).toBe('يناير - مارس 2025')
        expect(getPeriodLabel('2025S1', ar)).toBe('يناير - يونيو 2025')
        expect(getPeriodLabel('2025April', ar)).toBe('أبريل 2025 - مارس 2026')
        expect(getPeriodLabel('20250103', ar)).toBe('3 يناير 2025')
        expect(getPeriodLabel('2025', ar)).toBe('2025')
    })

    it('translates weekly and bi-weekly periods', () => {
        expect(getPeriodLabel('2025W5', ar)).toBe(
            'الأسبوع 5 - 2025-01-27 - 2025-02-02'
        )
        expect(getPeriodLabel('2025BiW3', ar)).toBe(
            'فترة الأسبوعين 3 - 2025-01-27 - 2025-02-09'
        )
        expect(getPeriodLabel('2025W5', en)).toBe(
            'Week 5 - 2025-01-27 - 2025-02-02'
        )
    })

    it('falls back for unknown periods', () => {
        expect(
            getPeriodLabel('UNKNOWN', { ...ar, fallback: 'From DHIS2' })
        ).toBe('From DHIS2')
        expect(getPeriodLabel('UNKNOWN', ar)).toBe('UNKNOWN')
    })
})

describe('period types and categories', () => {
    it('translates period types by category', () => {
        expect(getPeriodTypeLabel('MONTHLY', 'RELATIVE', ar)).toBe('الأشهر')
        expect(getPeriodTypeLabel('MONTHLY', 'FIXED', ar)).toBe('شهري')
        expect(getPeriodTypeLabel('MONTHLY', 'FIXED', en)).toBe('Monthly')
        expect(
            getPeriodTypeLabel('UNKNOWN', 'FIXED', { ...ar, fallback: 'X' })
        ).toBe('X')
    })

    it('translates period categories', () => {
        expect(getPeriodCategoryLabel('RELATIVE', ar)).toBe('نسبية')
        expect(getPeriodCategoryLabel('FIXED', en)).toBe('Fixed')
    })
})
