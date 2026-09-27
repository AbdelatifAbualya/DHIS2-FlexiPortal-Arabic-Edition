import type {
    ContentTranslationsConfig,
    TranslationDictionary,
} from '../schemas/translations'

/*
 * Keys of the configuration objects whose string values are displayed to portal visitors.
 * Only these keys are translated or offered for translation, everything else (ids, paths, urls, colors...) is left as is.
 * */
export const TRANSLATABLE_KEYS: ReadonlySet<string> = new Set([
    'label',
    'title',
    'text',
    'name',
    'shortName',
    'description',
    'shortDescription',
    'preamble',
    'caption',
    'content',
    'copyright',
    'staticContent',
])

/*
 * Keys whose values never contain visitor facing text. They are skipped to avoid walking large structures like layouts.
 * */
const SKIPPED_KEYS: ReadonlySet<string> = new Set([
    'layouts',
    'style',
    'icons',
    'periodConfig',
    'orgUnitConfig',
    'recipients',
    'colors',
])

export function normalizeTranslationSource(source: string): string {
    return source.trim()
}

export function isRichTextSource(source: string): boolean {
    return /<([a-z][a-z0-9]*)\b[^>]*>/i.test(source)
}

export function getTranslationDictionary(
    config: ContentTranslationsConfig | undefined | null,
    locale: string
): TranslationDictionary {
    const dictionary = config?.locales?.[locale]
    if (!dictionary || typeof dictionary !== 'object') {
        return {}
    }
    return dictionary
}

/*
 * The translation of a source text, if any. Only the dictionary's own entries are used, so that texts like
 * `constructor` or `toString` never resolve to properties inherited from Object.
 * */
export function getTranslation(
    dictionary: TranslationDictionary,
    source: string
): string | undefined {
    if (!Object.prototype.hasOwnProperty.call(dictionary, source)) {
        return undefined
    }
    const translation = dictionary[source]
    return typeof translation === 'string' && translation.trim()
        ? translation
        : undefined
}

export function translateText(
    source: string,
    dictionary: TranslationDictionary
): string {
    const normalized = normalizeTranslationSource(source)
    if (!normalized) {
        return source
    }
    return getTranslation(dictionary, normalized) ?? source
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype
    )
}

/*
 * Returns a copy of the configuration with all visitor facing texts replaced by their translation.
 * Texts without a translation are returned unchanged. The input is never mutated.
 * */
export function translateConfig<T>(
    value: T,
    dictionary: TranslationDictionary
): T {
    if (Object.keys(dictionary).length === 0) {
        return value
    }
    return translateValue(value, dictionary) as T
}

function translateValue(
    value: unknown,
    dictionary: TranslationDictionary
): unknown {
    if (Array.isArray(value)) {
        return value.map((item) => translateValue(item, dictionary))
    }
    if (!isPlainObject(value)) {
        return value
    }
    const translated: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(value)) {
        if (SKIPPED_KEYS.has(key)) {
            translated[key] = child
        } else if (typeof child === 'string') {
            translated[key] = TRANSLATABLE_KEYS.has(key)
                ? translateText(child, dictionary)
                : child
        } else {
            translated[key] = translateValue(child, dictionary)
        }
    }
    return translated
}

export interface TranslatableString {
    source: string
    /*
     * Where the text was found, e.g. ['Malaria Surveillance', 'config', 'title']
     * */
    locations: string[][]
}

function getItemName(item: unknown, index: number): string {
    if (isPlainObject(item)) {
        for (const key of ['label', 'title', 'name', 'id']) {
            const candidate = item[key]
            if (typeof candidate === 'string' && candidate.trim()) {
                return candidate.trim()
            }
        }
        if (isPlainObject(item.item)) {
            return getItemName(item.item, index)
        }
    }
    return `#${index + 1}`
}

function collectValue(
    value: unknown,
    path: string[],
    result: Map<string, TranslatableString>
) {
    if (Array.isArray(value)) {
        value.forEach((item, index) =>
            collectValue(item, [...path, getItemName(item, index)], result)
        )
        return
    }
    if (!isPlainObject(value)) {
        return
    }
    for (const [key, child] of Object.entries(value)) {
        if (SKIPPED_KEYS.has(key)) {
            continue
        }
        if (typeof child === 'string') {
            if (!TRANSLATABLE_KEYS.has(key)) {
                continue
            }
            const source = normalizeTranslationSource(child)
            if (!source) {
                continue
            }
            const existing = result.get(source)
            if (existing) {
                existing.locations.push([...path, key])
            } else {
                result.set(source, { source, locations: [[...path, key]] })
            }
        } else {
            collectValue(child, [...path, key], result)
        }
    }
}

/*
 * Lists all unique visitor facing texts of the given configurations, together with where they are used.
 * */
export function collectTranslatableStrings(
    sources: Array<{ name: string; value: unknown }>
): TranslatableString[] {
    const result = new Map<string, TranslatableString>()
    for (const { name, value } of sources) {
        collectValue(value, [name], result)
    }
    return Array.from(result.values())
}
