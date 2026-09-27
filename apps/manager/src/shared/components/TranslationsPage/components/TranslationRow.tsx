import {
    Button,
    DataTableCell,
    DataTableRow,
    IconEdit16,
    Tag,
    TextArea,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { memo, useState } from 'react'
import { isRichTextSource, TranslatableString } from '@packages/shared/utils'
import { RichTextTranslationModal } from './RichTextTranslationModal'

/*
 * Plain text preview of a html content. DOMParser does not execute scripts.
 * */
function toPlainText(html: string): string {
    const document = new DOMParser().parseFromString(html, 'text/html')
    return (document.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

export const TranslationRow = memo(function TranslationRow({
    item,
    value,
    locale,
    languageName,
    direction,
    onChange,
}: {
    item: TranslatableString
    value?: string
    locale: string
    languageName: string
    direction: 'rtl' | 'ltr'
    onChange: (source: string, value: string) => void
}) {
    const [editing, setEditing] = useState(false)
    const isRichText = isRichTextSource(item.source)
    const isTranslated = !!value?.trim()

    return (
        <DataTableRow>
            <DataTableCell width="38%">
                <div className="flex flex-col gap-1">
                    {isRichText ? (
                        <>
                            <Tag>{i18n.t('Rich text')}</Tag>
                            <span className="line-clamp-4 text-gray-700">
                                {toPlainText(item.source)}
                            </span>
                        </>
                    ) : (
                        <span className="whitespace-pre-wrap">
                            {item.source}
                        </span>
                    )}
                </div>
            </DataTableCell>
            <DataTableCell width="42%">
                {isRichText ? (
                    <div className="flex flex-col gap-2 items-start">
                        {isTranslated ? (
                            <span
                                dir={direction}
                                lang={locale}
                                className="line-clamp-4 text-gray-700 w-full"
                            >
                                {toPlainText(value!)}
                            </span>
                        ) : (
                            <span className="text-gray-500 italic">
                                {i18n.t('Not translated')}
                            </span>
                        )}
                        <Button
                            small
                            icon={<IconEdit16 />}
                            onClick={() => setEditing(true)}
                        >
                            {isTranslated
                                ? i18n.t('Edit translation')
                                : i18n.t('Translate')}
                        </Button>
                        {editing && (
                            <RichTextTranslationModal
                                source={item.source}
                                value={value}
                                languageName={languageName}
                                direction={direction}
                                onClose={() => setEditing(false)}
                                onSave={(newValue) =>
                                    onChange(item.source, newValue)
                                }
                            />
                        )}
                    </div>
                ) : (
                    <div dir={direction} lang={locale}>
                        <TextArea
                            dense
                            rows={item.source.length > 80 ? 3 : 1}
                            autoGrow
                            value={value ?? ''}
                            onChange={({ value: newValue }) =>
                                onChange(item.source, newValue ?? '')
                            }
                        />
                    </div>
                )}
            </DataTableCell>
            <DataTableCell width="20%">
                <ul className="text-xs text-gray-600 flex flex-col gap-1">
                    {item.locations.slice(0, 3).map((location) => (
                        <li key={location.join('/')}>{location.join(' › ')}</li>
                    ))}
                    {item.locations.length > 3 && (
                        <li>
                            {i18n.t('and {{count}} more', {
                                count: item.locations.length - 3,
                            })}
                        </li>
                    )}
                </ul>
            </DataTableCell>
        </DataTableRow>
    )
})
