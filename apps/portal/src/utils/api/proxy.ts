/*
 * DHIS2 resources that the browser can read through the portal's `/api` proxy. Every other resource is refused, since
 * the proxy authenticates requests with the portal's Personal Access Token.
 * */
const ALLOWED_RESOURCES = [
    'analytics',
    'legendSets',
    'organisationUnits',
    'geoFeatures',
    'tokens/google',
] as const

/*
 * Resources whose names DHIS2 translates when a locale is requested
 * */
const TRANSLATABLE_RESOURCES = [
    'analytics',
    'legendSets',
    'organisationUnits',
    'geoFeatures',
] as const

/*
 * The DHIS2 path to forward, from the url of a request to the proxy, e.g.
 * `https://portal.org/some/path/api/analytics?dimension=dx:abc` -> `analytics?dimension=dx:abc`
 * */
export function getProxyPath(url: string): string {
    return url.substring(url.lastIndexOf('/api/') + '/api/'.length)
}

/*
 * The resource part of a proxy path, without the query, the leading slashes and the optional API version
 * (`analytics.json`, `40/analytics`...). Returns undefined for paths that could escape the resource (`..` segments).
 * */
function getResourcePath(path: string): string | undefined {
    const queryIndex = path.indexOf('?')
    const pathname = queryIndex === -1 ? path : path.substring(0, queryIndex)
    let decoded: string
    try {
        decoded = decodeURIComponent(pathname)
    } catch {
        return undefined
    }
    if (decoded.includes('\\')) {
        return undefined
    }
    const segments = decoded.split('/').filter(Boolean)
    if (segments.some((segment) => segment === '.' || segment === '..')) {
        return undefined
    }
    if (segments.length > 0 && /^\d+$/.test(segments[0])) {
        segments.shift()
    }
    return segments.join('/')
}

function matchesResource(
    path: string,
    resources: ReadonlyArray<string>
): boolean {
    const resourcePath = getResourcePath(path)
    if (resourcePath === undefined) {
        return false
    }
    return resources.some(
        (resource) =>
            resourcePath === resource ||
            resourcePath.startsWith(`${resource}/`) ||
            resourcePath.startsWith(`${resource}.`)
    )
}

export function isAllowedProxyPath(path: string): boolean {
    return matchesResource(path, ALLOWED_RESOURCES)
}

export function isTranslatableProxyPath(path: string): boolean {
    return matchesResource(path, TRANSLATABLE_RESOURCES)
}

export function isAnalyticsProxyPath(path: string): boolean {
    return matchesResource(path, ['analytics'])
}
