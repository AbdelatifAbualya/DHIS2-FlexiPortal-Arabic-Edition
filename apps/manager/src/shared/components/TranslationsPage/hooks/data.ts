import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import i18n from '@dhis2/d2-i18n'
import { DatastoreKeys, DatastoreNamespaces } from '@packages/shared/constants'
import {
    AppModule,
    ContentTranslationsConfig,
    contentTranslationsConfigSchema,
    ModuleType,
    TranslationDictionary,
} from '@packages/shared/schemas'
import {
    collectTranslatableStrings,
    TranslatableString,
} from '@packages/shared/utils'

type DataEngine = ReturnType<typeof useDataEngine>

const PAGE_SIZE = 100

function isNotFound(error: unknown) {
    return (
        (error as { details?: { httpStatusCode?: number } })?.details
            ?.httpStatusCode === 404
    )
}

async function getValue<T>(
    engine: DataEngine,
    namespace: string,
    key: string
): Promise<T | undefined> {
    try {
        const { result } = await engine.query({
            result: { resource: `dataStore/${namespace}/${key}` },
        })
        return (result ?? undefined) as T | undefined
    } catch (error) {
        if (isNotFound(error)) {
            return undefined
        }
        throw error
    }
}

async function getEntries<T>(
    engine: DataEngine,
    namespace: string
): Promise<T[]> {
    const values: T[] = []
    for (let page = 1; ; page++) {
        try {
            const { result } = await engine.query({
                result: {
                    resource: `dataStore/${namespace}`,
                    params: { fields: '.', page, pageSize: PAGE_SIZE },
                },
            })
            const entries =
                (result as { entries?: Array<{ value: T }> })?.entries ?? []
            values.push(...entries.map(({ value }) => value))
            if (entries.length < PAGE_SIZE) {
                return values
            }
        } catch (error) {
            if (isNotFound(error)) {
                return values
            }
            throw error
        }
    }
}

export interface TranslationsData {
    strings: TranslatableString[]
    config: ContentTranslationsConfig
}

async function getTranslationsData(
    engine: DataEngine
): Promise<TranslationsData> {
    const namespace = DatastoreNamespaces.MAIN_CONFIG
    const [metadata, appearance, menu, translations, modules] =
        await Promise.all([
            getValue(engine, namespace, DatastoreKeys.METADATA),
            getValue(engine, namespace, DatastoreKeys.APPEARANCE),
            getValue(engine, namespace, DatastoreKeys.MENU),
            getValue(engine, namespace, DatastoreKeys.TRANSLATIONS),
            getEntries<AppModule>(engine, DatastoreNamespaces.MODULES),
        ])

    const staticNamespaces = Array.from(
        new Set(
            modules
                .filter((module) => module.type === ModuleType.STATIC)
                .map((module) =>
                    'namespace' in module.config
                        ? module.config.namespace
                        : undefined
                )
                .filter((value): value is string => !!value)
        )
    )
    const staticItems = await Promise.all(
        staticNamespaces.map(async (staticNamespace) => ({
            namespace: staticNamespace,
            items: await getEntries(engine, staticNamespace),
        }))
    )

    const strings = collectTranslatableStrings([
        { name: i18n.t('General'), value: metadata },
        { name: i18n.t('Appearance'), value: appearance },
        { name: i18n.t('App Menu'), value: menu },
        ...modules.map((module) => ({
            name: `${i18n.t('Module')}: ${module.label ?? module.id}`,
            value: module,
        })),
        ...staticItems.map(({ namespace, items }) => ({
            name: `${i18n.t('Static items')}: ${namespace}`,
            value: items,
        })),
    ])

    const parsed = contentTranslationsConfigSchema.safeParse(
        translations ?? { locales: {} }
    )
    if (!parsed.success) {
        console.error(
            'Invalid translations configuration, starting from empty translations',
            parsed.error
        )
    }

    return {
        strings,
        config: parsed.success ? parsed.data : { locales: {} },
    }
}

export const TRANSLATIONS_QUERY_KEY = ['portal-content-translations']

export function useTranslationsData() {
    const engine = useDataEngine()
    return useQuery({
        queryKey: TRANSLATIONS_QUERY_KEY,
        queryFn: () => getTranslationsData(engine),
    })
}

/*
 * Only non empty translations are saved
 * */
export function cleanDictionary(
    dictionary: TranslationDictionary
): TranslationDictionary {
    return Object.fromEntries(
        Object.entries(dictionary)
            .map(([source, value]) => [source.trim(), value.trim()])
            .filter(([source, value]) => source && value)
    )
}

export function useSaveTranslations() {
    const engine = useDataEngine()
    const queryClient = useQueryClient()
    const { show } = useAlert(
        ({ message }) => message,
        ({ type }) => ({ ...type, duration: 3000 })
    )

    return useMutation({
        mutationFn: async ({
            locale,
            dictionary,
        }: {
            locale: string
            dictionary: TranslationDictionary
        }) => {
            // The latest configuration is fetched so that translations of other languages are never overwritten
            const current = contentTranslationsConfigSchema.safeParse(
                (await getValue(
                    engine,
                    DatastoreNamespaces.MAIN_CONFIG,
                    DatastoreKeys.TRANSLATIONS
                )) ?? { locales: {} }
            )
            const config: ContentTranslationsConfig = {
                locales: {
                    ...(current.success ? current.data.locales : {}),
                    [locale]: cleanDictionary(dictionary),
                },
            }
            const resource = `dataStore/${DatastoreNamespaces.MAIN_CONFIG}`
            await engine
                .mutate({
                    resource,
                    id: DatastoreKeys.TRANSLATIONS,
                    type: 'update',
                    data: config,
                })
                .catch(async (error) => {
                    if (!isNotFound(error)) {
                        throw error
                    }
                    await engine.mutate({
                        resource: `${resource}/${DatastoreKeys.TRANSLATIONS}`,
                        type: 'create',
                        data: config,
                    })
                })
            return config
        },
        onSuccess: async () => {
            show({
                message: i18n.t('Translations saved successfully'),
                type: { success: true },
            })
            await queryClient.invalidateQueries({
                queryKey: TRANSLATIONS_QUERY_KEY,
            })
        },
        onError: (error) => {
            show({
                message: `${i18n.t('Could not save translations')}: ${
                    error instanceof Error ? error.message : String(error)
                }`,
                type: { critical: true },
            })
        },
    })
}
