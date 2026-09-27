import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import { RichTextEditor } from '@hisptz/dhis2-ui'
import i18n from '@dhis2/d2-i18n'
import { useMemo, useRef } from 'react'

export function RichTextTranslationModal({
    source,
    value,
    languageName,
    direction,
    onSave,
    onClose,
}: {
    source: string
    value?: string
    languageName: string
    direction: 'rtl' | 'ltr'
    onSave: (value: string) => void
    onClose: () => void
}) {
    // Starting from the source keeps its formatting, only the texts need to be translated
    const initialValue = value || source
    // The editor reports its value when it loses focus, the latest value is kept here
    const draft = useRef<string>(initialValue)

    const config = useMemo(
        () => ({
            direction,
            minHeight: 320,
        }),
        [direction]
    )

    return (
        <Modal large position="middle" onClose={onClose}>
            <ModalTitle>
                {i18n.t('Translate to {{language}}', {
                    language: languageName,
                })}
            </ModalTitle>
            <ModalContent>
                <div dir={direction}>
                    <RichTextEditor
                        name="translation"
                        config={config}
                        value={initialValue}
                        onChange={(newValue: string) => {
                            draft.current = newValue
                        }}
                    />
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onClose}>{i18n.t('Cancel')}</Button>
                    <Button
                        primary
                        onClick={() => {
                            onSave(draft.current)
                            onClose()
                        }}
                    >
                        {i18n.t('Apply')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
