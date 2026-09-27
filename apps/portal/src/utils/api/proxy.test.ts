import { describe, expect, it } from 'vitest'
import {
    getProxyPath,
    isAllowedProxyPath,
    isAnalyticsProxyPath,
    isTranslatableProxyPath,
} from './proxy'

describe('getProxyPath', () => {
    it('returns the path after the proxy prefix', () => {
        expect(
            getProxyPath('http://localhost:3000/api/analytics?dimension=dx:a')
        ).toBe('analytics?dimension=dx:a')
        expect(
            getProxyPath(
                'https://portal.org/sub/path/api/organisationUnits?fields=id'
            )
        ).toBe('organisationUnits?fields=id')
    })
})

describe('isAllowedProxyPath', () => {
    it('allows the resources used by the visualizations', () => {
        for (const path of [
            'analytics?dimension=dx:abc&filter=ou:LEVEL-2',
            'analytics.json?dimension=dx:abc',
            'analytics/events/query/abc?stage=x',
            'organisationUnits?fields=id,displayName',
            'organisationUnits/abc?fields=id',
            'geoFeatures?ou=ou:LEVEL-2',
            'legendSets/abc?fields=id,legends',
            'tokens/google',
            '40/analytics?dimension=dx:abc',
            '/analytics?dimension=dx:abc',
        ]) {
            expect(isAllowedProxyPath(path), path).toBe(true)
        }
    })

    it('refuses other resources, even when an allowed name appears elsewhere in the url', () => {
        for (const path of [
            'me?fields=username&x=analytics',
            'users?filter=analytics:eq:1',
            'dataStore/hisptz-public-portal?analytics',
            'dataStore/analytics',
            'system/info',
            'analyticsTableHooks',
            'organisationUnitsX',
            'tokens/googleX',
            '',
        ]) {
            expect(isAllowedProxyPath(path), path).toBe(false)
        }
    })

    it('refuses paths escaping an allowed resource', () => {
        for (const path of [
            'analytics/../me',
            'analytics/..%2F..%2Fme',
            'analytics/%2e%2e/me',
            'analytics/%2E%2E/me',
            'analytics/./../me',
            'analytics\\..\\me',
            'analytics%5C..%5Cme',
            'analytics/%E0%A4%A',
        ]) {
            expect(isAllowedProxyPath(path), path).toBe(false)
        }
    })
})

describe('isTranslatableProxyPath', () => {
    it('only matches resources translated by DHIS2', () => {
        expect(isTranslatableProxyPath('analytics?dimension=dx:a')).toBe(true)
        expect(isTranslatableProxyPath('organisationUnits?fields=id')).toBe(
            true
        )
        expect(isTranslatableProxyPath('tokens/google')).toBe(false)
    })
})

describe('isAnalyticsProxyPath', () => {
    it('matches analytics requests only', () => {
        expect(isAnalyticsProxyPath('analytics?dimension=dx:a')).toBe(true)
        expect(isAnalyticsProxyPath('analytics.json')).toBe(true)
        expect(isAnalyticsProxyPath('geoFeatures?ou=ou:a')).toBe(false)
    })
})
