import { describe, expect, it } from 'vitest'
import { getMessages } from '@/i18n/messages'
import { localizeAnalytics } from './analytics'
import { withDHIS2LocaleParams } from './dhis2'

const analytics = {
    headers: [
        { name: 'dx', column: 'Data', valueType: 'TEXT' },
        { name: 'pe', column: 'Period', valueType: 'TEXT' },
        { name: 'value', column: 'Value', valueType: 'NUMBER' },
    ],
    metaData: {
        items: {
            '202509': { name: 'September 2025' },
            LAST_12_MONTHS: { name: 'Last 12 months' },
            IcjKZBdA7ed: { name: 'حالات الملاريا المؤكدة' },
            UstIeKaaoRY: { name: 'Test region' },
            dx: { name: 'Data' },
            pe: { name: 'Period' },
            ou: { name: 'Organisation unit' },
        },
        dimensions: {
            dx: ['IcjKZBdA7ed'],
            pe: ['202509'],
            ou: ['UstIeKaaoRY'],
        },
    },
    rows: [['IcjKZBdA7ed', '202509', '12']],
}

describe('localizeAnalytics', () => {
    it('does not change english responses', () => {
        expect(
            localizeAnalytics(analytics, {
                locale: 'en',
                messages: getMessages('en'),
            })
        ).toBe(analytics)
    })

    it('translates periods, dimensions and headers', () => {
        const localized = localizeAnalytics(analytics, {
            locale: 'ar',
            messages: getMessages('ar'),
        })
        const items = localized.metaData.items
        expect(items['202509'].name).toBe('سبتمبر 2025')
        expect(items['LAST_12_MONTHS'].name).toBe('آخر 12 شهرًا')
        expect(items['dx'].name).toBe('البيانات')
        expect(items['pe'].name).toBe('الفترة')
        expect(items['ou'].name).toBe('الوحدة التنظيمية')
        expect(localized.headers.map(({ column }) => column)).toEqual([
            'البيانات',
            'الفترة',
            'القيمة',
        ])
    })

    it('keeps the metadata names translated by DHIS2 and the data', () => {
        const localized = localizeAnalytics(analytics, {
            locale: 'ar',
            messages: getMessages('ar'),
        })
        expect(localized.metaData.items['IcjKZBdA7ed'].name).toBe(
            'حالات الملاريا المؤكدة'
        )
        expect(localized.metaData.items['UstIeKaaoRY'].name).toBe('Test region')
        expect(localized.rows).toEqual(analytics.rows)
        expect(localized.metaData.dimensions).toEqual(
            analytics.metaData.dimensions
        )
    })

    it('does not mutate the response', () => {
        const copy = structuredClone(analytics)
        localizeAnalytics(analytics, {
            locale: 'ar',
            messages: getMessages('ar'),
        })
        expect(analytics).toEqual(copy)
    })

    it('handles responses without metadata', () => {
        const messages = getMessages('ar')
        expect(
            localizeAnalytics({ rows: [] }, { locale: 'ar', messages })
        ).toEqual({ rows: [], headers: undefined })
        expect(localizeAnalytics(null, { locale: 'ar', messages })).toBeNull()
    })
})

describe('withDHIS2LocaleParams', () => {
    it('adds the locale parameters and keeps repeated parameters', () => {
        const path = withDHIS2LocaleParams(
            'analytics?dimension=dx:abc&dimension=pe:LAST_12_MONTHS&filter=ou:LEVEL-2',
            'ar'
        )
        const [pathname, query] = path.split('?')
        const params = new URLSearchParams(query)
        expect(pathname).toBe('analytics')
        expect(params.getAll('dimension')).toEqual([
            'dx:abc',
            'pe:LAST_12_MONTHS',
        ])
        expect(params.get('filter')).toBe('ou:LEVEL-2')
        expect(params.get('translate')).toBe('true')
        expect(params.get('locale')).toBe('ar')
    })

    it('replaces locale parameters sent by the client', () => {
        const params = new URLSearchParams(
            withDHIS2LocaleParams('organisationUnits?locale=fr', 'en').split(
                '?'
            )[1]
        )
        expect(params.getAll('locale')).toEqual(['en'])
    })

    it('handles paths without query parameters', () => {
        expect(withDHIS2LocaleParams('geoFeatures', 'ar')).toBe(
            'geoFeatures?translate=true&locale=ar'
        )
    })
})
