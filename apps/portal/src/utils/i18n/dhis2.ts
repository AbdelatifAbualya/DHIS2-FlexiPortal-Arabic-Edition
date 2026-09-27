/*
 * Query parameters asking DHIS2 to return metadata display names (displayName, analytics item names...)
 * translated in the given locale. Untranslated metadata falls back to its default name.
 * */
export function getDHIS2LocaleParams(locale: string): Record<string, string> {
    return {
        translate: 'true',
        locale,
    }
}

/*
 * Adds (or replaces) the locale parameters of a DHIS2 API path, e.g. `analytics?dimension=dx:abc`
 * */
export function withDHIS2LocaleParams(path: string, locale: string): string {
    const queryIndex = path.indexOf('?')
    const pathname = queryIndex === -1 ? path : path.substring(0, queryIndex)
    const params = new URLSearchParams(
        queryIndex === -1 ? '' : path.substring(queryIndex + 1)
    )
    for (const [key, value] of Object.entries(getDHIS2LocaleParams(locale))) {
        params.set(key, value)
    }
    return `${pathname}?${params.toString()}`
}
