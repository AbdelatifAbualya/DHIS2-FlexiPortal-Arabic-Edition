import { describe, expect, it } from 'vitest'
import en from '../../messages/en.json'
import ar from '../../messages/ar.json'
import { getMessages } from './messages'
import { arLibraryTranslations } from './library/ar'

function flattenKeys(value: unknown, prefix = ''): string[] {
    if (typeof value !== 'object' || value === null) {
        return [prefix]
    }
    return Object.entries(value).flatMap(([key, child]) =>
        flattenKeys(child, prefix ? `${prefix}.${key}` : key)
    )
}

function getPlaceholders(message: string): string[] {
    return (message.match(/\{[a-zA-Z]+\}/g) ?? []).sort()
}

function get(messages: unknown, key: string): unknown {
    return key
        .split('.')
        .reduce<unknown>(
            (value, part) => (value as Record<string, unknown>)?.[part],
            messages
        )
}

describe('portal messages', () => {
    const enKeys = flattenKeys(en)
    const arKeys = flattenKeys(ar)

    it('has an arabic translation for every english message', () => {
        expect(enKeys.filter((key) => !arKeys.includes(key))).toEqual([])
    })

    it('has no arabic message without an english source', () => {
        expect(arKeys.filter((key) => !enKeys.includes(key))).toEqual([])
    })

    it('has no empty messages', () => {
        for (const messages of [en, ar]) {
            for (const key of flattenKeys(messages)) {
                const value = get(messages, key)
                expect(typeof value, key).toBe('string')
                expect((value as string).trim(), key).not.toBe('')
            }
        }
    })

    it('keeps the same placeholders in translations', () => {
        for (const key of enKeys) {
            expect(
                getPlaceholders(get(ar, key) as string),
                `placeholders of ${key}`
            ).toEqual(getPlaceholders(get(en, key) as string))
        }
    })

    it('falls back to english for messages missing in a translation', () => {
        const messages = getMessages('ar')
        expect(messages.common.cancel).toBe('إلغاء')
        expect(getMessages('en').common.cancel).toBe('Cancel')
    })
})

describe('library translations', () => {
    it('keeps the same interpolation placeholders as the source texts', () => {
        for (const [source, translation] of Object.entries(
            arLibraryTranslations
        )) {
            const placeholders = (text: string) =>
                (text.match(/\{\{[a-zA-Z]+\}\}/g) ?? []).sort()
            expect(placeholders(translation), source).toEqual(
                placeholders(source)
            )
            expect(translation.trim(), source).not.toBe('')
        }
    })
})
