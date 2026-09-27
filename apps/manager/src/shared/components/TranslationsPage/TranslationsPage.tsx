import {
    Button,
    ButtonStrip,
    CheckboxField,
    CircularLoader,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
    InputField,
    NoticeBox,
    Pagination,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    getLocaleDirection,
    LOCALE_LABELS,
    SOURCE_LOCALE,
    SUPPORTED_LOCALES,
    SupportedLocale,
} from '@packages/shared/constants'
import { TranslationDictionary } from '@packages/shared/schemas'
import { isEqual } from 'lodash-es'
import { getTranslation } from '@packages/shared/utils'
import {
    cleanDictionary,
    useSaveTranslations,
    useTranslationsData,
} from './hooks/data'
import { TranslationRow } from './components/TranslationRow'

const PAGE_SIZE = 25

/*
 * The value being edited for a text, as typed. Only own entries are read, never inherited Object properties.
 * */
function getOwnValue(
    dictionary: TranslationDictionary,
    source: string
): string | undefined {
    return Object.prototype.hasOwnProperty.call(dictionary, source)
        ? dictionary[source]
        : undefined
}

const TRANSLATION_LOCALES = SUPPORTED_LOCALES.filter(
    (locale) => locale !== SOURCE_LOCALE
)

export function TranslationsPage() {
    const { data, isLoading, error, refetch } = useTranslationsData()
    const { mutateAsync: save, isPending: saving } = useSaveTranslations()

    const [locale, setLocale] = useState<SupportedLocale>(
        TRANSLATION_LOCALES[0]
    )
    const [dictionary, setDictionary] = useState<TranslationDictionary>({})
    const [search, setSearch] = useState('')
    const [untranslatedOnly, setUntranslatedOnly] = useState(false)
    const [page, setPage] = useState(1)

    const savedDictionary = useMemo(
        () => data?.config.locales[locale] ?? {},
        [data, locale]
    )

    useEffect(() => {
        setDictionary(savedDictionary)
    }, [savedDictionary])

    const direction = getLocaleDirection(locale)
    const languageName = LOCALE_LABELS[locale]
    const strings = useMemo(() => data?.strings ?? [], [data])

    const isDirty = !isEqual(
        cleanDictionary(dictionary),
        cleanDictionary(savedDictionary)
    )

    const translatedCount = strings.filter(({ source }) =>
        getTranslation(dictionary, source)
    ).length

    const unusedSources = useMemo(() => {
        const sources = new Set(strings.map(({ source }) => source))
        return Object.keys(dictionary).filter(
            (source) =>
                !sources.has(source) && getTranslation(dictionary, source)
        )
    }, [strings, dictionary])

    // Filtering uses the saved translations, so that rows do not disappear while a translation is being typed
    const filteredStrings = useMemo(() => {
        const keyword = search.trim().toLowerCase()
        return strings.filter(({ source, locations }) => {
            if (untranslatedOnly && getTranslation(savedDictionary, source)) {
                return false
            }
            if (!keyword) {
                return true
            }
            return (
                source.toLowerCase().includes(keyword) ||
                (getTranslation(savedDictionary, source) ?? '')
                    .toLowerCase()
                    .includes(keyword) ||
                locations.some((location) =>
                    location.join(' ').toLowerCase().includes(keyword)
                )
            )
        })
    }, [strings, search, untranslatedOnly, savedDictionary])

    const pageCount = Math.max(1, Math.ceil(filteredStrings.length / PAGE_SIZE))
    const currentPage = Math.min(page, pageCount)
    const pageStrings = filteredStrings.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    )

    const onChange = useCallback((source: string, value: string) => {
        setDictionary((previous) => ({ ...previous, [source]: value }))
    }, [])

    const onRemoveUnused = () => {
        setDictionary((previous) =>
            Object.fromEntries(
                Object.entries(previous).filter(
                    ([source]) => !unusedSources.includes(source)
                )
            )
        )
    }

    const onSave = async () => {
        await save({ locale, dictionary })
    }

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <CircularLoader />
            </div>
        )
    }

    if (error) {
        return (
            <NoticeBox error title={i18n.t('Could not load translations')}>
                <div className="flex flex-col gap-2 items-start">
                    {error instanceof Error ? error.message : String(error)}
                    <Button small onClick={() => refetch()}>
                        {i18n.t('Try again')}
                    </Button>
                </div>
            </NoticeBox>
        )
    }

    return (
        <div className="flex flex-col gap-4 pb-4">
            <p className="text-gray-600 text-sm">
                {i18n.t(
                    'Translate the texts configured for the portal (menu, titles, descriptions, captions, rich text, footer...). Visitors that select another language see these translations, texts without a translation are displayed in English. Names of DHIS2 visualizations, data items and organisation units are translated in DHIS2 itself, using the Translations app or the Maintenance app.'
                )}
            </p>
            <div className="flex flex-wrap gap-4 items-end">
                <div className="min-w-[240px]">
                    <SingleSelectField
                        label={i18n.t('Language')}
                        selected={locale}
                        disabled={isDirty}
                        helpText={
                            isDirty
                                ? i18n.t(
                                      'Save or discard your changes before changing the language'
                                  )
                                : undefined
                        }
                        onChange={({ selected }) => {
                            setLocale(selected as SupportedLocale)
                            setPage(1)
                        }}
                    >
                        {TRANSLATION_LOCALES.map((value) => (
                            <SingleSelectOption
                                key={value}
                                value={value}
                                label={LOCALE_LABELS[value]}
                            />
                        ))}
                    </SingleSelectField>
                </div>
                <div className="min-w-[280px] flex-1">
                    <InputField
                        label={i18n.t('Search')}
                        placeholder={i18n.t('Search texts or translations')}
                        value={search}
                        onChange={({ value }) => {
                            setSearch(value ?? '')
                            setPage(1)
                        }}
                    />
                </div>
                <CheckboxField
                    label={i18n.t('Show untranslated texts only')}
                    checked={untranslatedOnly}
                    onChange={({ checked }) => {
                        setUntranslatedOnly(checked)
                        setPage(1)
                    }}
                />
                <span
                    className="text-sm text-gray-700"
                    data-test="translations-progress"
                >
                    {i18n.t('{{translated}} of {{total}} texts translated', {
                        translated: translatedCount,
                        total: strings.length,
                    })}
                </span>
            </div>

            {unusedSources.length > 0 && (
                <NoticeBox title={i18n.t('Unused translations')}>
                    <div className="flex flex-col gap-2 items-start">
                        {i18n.t(
                            '{{count}} saved translations are for texts that are no longer used in the portal configuration, for example because the english text was changed.',
                            { count: unusedSources.length }
                        )}
                        <Button small onClick={onRemoveUnused}>
                            {i18n.t('Remove unused translations')}
                        </Button>
                    </div>
                </NoticeBox>
            )}

            <DataTable>
                <DataTableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>
                            {i18n.t('Text ({{language}})', {
                                language: LOCALE_LABELS[SOURCE_LOCALE],
                            })}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Translation ({{language}})', {
                                language: languageName,
                            })}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Used in')}
                        </DataTableColumnHeader>
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                    {pageStrings.length === 0 ? (
                        <DataTableRow>
                            <DataTableCell colSpan="3">
                                <span className="text-gray-500">
                                    {strings.length === 0
                                        ? i18n.t(
                                              'There are no texts to translate yet. Configure the portal first.'
                                          )
                                        : i18n.t(
                                              'No texts match the current filters'
                                          )}
                                </span>
                            </DataTableCell>
                        </DataTableRow>
                    ) : (
                        pageStrings.map((item) => (
                            <TranslationRow
                                key={`${locale}-${item.source}`}
                                item={item}
                                value={getOwnValue(dictionary, item.source)}
                                locale={locale}
                                languageName={languageName}
                                direction={direction}
                                onChange={onChange}
                            />
                        ))
                    )}
                </DataTableBody>
            </DataTable>

            {filteredStrings.length > PAGE_SIZE && (
                <Pagination
                    page={currentPage}
                    pageCount={pageCount}
                    pageSize={PAGE_SIZE}
                    total={filteredStrings.length}
                    onPageChange={setPage}
                    hidePageSizeSelect
                />
            )}

            <div className="sticky bottom-0 bg-white py-3 border-t border-gray-200">
                <ButtonStrip end>
                    <Button
                        disabled={!isDirty || saving}
                        onClick={() => setDictionary(savedDictionary)}
                    >
                        {i18n.t('Discard changes')}
                    </Button>
                    <Button
                        primary
                        loading={saving}
                        disabled={!isDirty || saving}
                        onClick={onSave}
                        dataTest="save-translations-button"
                    >
                        {i18n.t('Save translations')}
                    </Button>
                </ButtonStrip>
            </div>
        </div>
    )
}
