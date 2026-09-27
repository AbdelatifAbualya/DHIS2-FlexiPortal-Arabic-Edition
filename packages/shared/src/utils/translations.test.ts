import { describe, expect, it } from 'vitest'
import {
    collectTranslatableStrings,
    getTranslation,
    getTranslationDictionary,
    isRichTextSource,
    translateConfig,
    translateText,
} from './translations'

const menu = {
    position: 'sidebar',
    collapsible: true,
    items: [
        {
            path: 'home',
            type: 'module',
            label: 'Home',
            moduleId: 'home',
            sortOrder: 1,
        },
        {
            path: 'malaria',
            type: 'group',
            label: 'Malaria',
            sortOrder: 2,
            items: [
                {
                    path: 'cases',
                    type: 'module',
                    label: 'Cases',
                    moduleId: 'cases',
                    sortOrder: 1,
                },
            ],
        },
    ],
}

const visualizationModule = {
    id: 'malaria-surveillance',
    type: 'VISUALIZATION',
    label: 'Malaria Surveillance',
    config: {
        title: 'Malaria Case Surveillance',
        grouped: false,
        shortDescription: 'Confirmed cases',
        items: [
            {
                type: 'VISUALIZATION',
                item: { id: 'Z90NM1oWJCa', type: 'CHART', caption: 'Trend' },
            },
            {
                type: 'RICH_TEXT',
                item: { id: 'note', content: '<p>Welcome</p>' },
            },
        ],
        layouts: {
            lg: [{ i: 'Home', x: 0, y: 0, w: 12, h: 8 }],
        },
    },
}

const appearance = {
    header: {
        title: { text: 'Health Portal', style: { align: 'left' } },
        subtitle: { text: 'Public data' },
        style: { coloredBackground: true },
    },
    footer: {
        copyright: 'Ministry of Health',
        footerItems: [
            {
                title: 'Links',
                type: 'links',
                links: [{ name: 'DHIS2', url: 'https://dhis2.org' }],
            },
        ],
    },
}

const dictionary = {
    Home: 'الرئيسية',
    Malaria: 'الملاريا',
    Cases: 'الحالات',
    'Malaria Surveillance': 'ترصد الملاريا',
    'Malaria Case Surveillance': 'ترصد حالات الملاريا',
    Trend: 'الاتجاه',
    '<p>Welcome</p>': '<p>مرحبا</p>',
    'Health Portal': 'البوابة الصحية',
    Links: 'روابط',
    DHIS2: 'دي إتش آي إس 2',
    left: 'يسار',
    home: 'should never be used for ids or paths',
    Z90NM1oWJCa: 'should never be used for ids',
}

describe('translateText', () => {
    it('returns the translation of a known text', () => {
        expect(translateText('Home', dictionary)).toBe('الرئيسية')
    })

    it('ignores surrounding white space of the source text', () => {
        expect(translateText('  Home \n', dictionary)).toBe('الرئيسية')
    })

    it('falls back to the source text when there is no translation', () => {
        expect(translateText('Unknown', dictionary)).toBe('Unknown')
    })

    it('falls back to the source text when the translation is empty', () => {
        expect(translateText('Home', { Home: '   ' })).toBe('Home')
    })

    it('does not translate empty texts', () => {
        expect(translateText('', { '': 'x' })).toBe('')
    })
})

describe('translateConfig', () => {
    it('translates menu labels including nested group items', () => {
        const translated = translateConfig(menu, dictionary)
        expect(translated.items[0].label).toBe('الرئيسية')
        expect(translated.items[1].label).toBe('الملاريا')
        expect(translated.items[1].items![0].label).toBe('الحالات')
    })

    it('never translates ids, paths or other technical values', () => {
        const translated = translateConfig(menu, dictionary)
        expect(translated.items[0].path).toBe('home')
        expect(translated.items[0].moduleId).toBe('home')
        expect(translated.items[0].type).toBe('module')

        const translatedModule = translateConfig(
            visualizationModule,
            dictionary
        )
        expect(translatedModule.id).toBe('malaria-surveillance')
        expect(translatedModule.config.items[0].item.id).toBe('Z90NM1oWJCa')
    })

    it('translates module texts, captions and rich text', () => {
        const translated = translateConfig(visualizationModule, dictionary)
        expect(translated.label).toBe('ترصد الملاريا')
        expect(translated.config.title).toBe('ترصد حالات الملاريا')
        expect(translated.config.shortDescription).toBe('Confirmed cases')
        expect(
            (translated.config.items[0].item as { caption: string }).caption
        ).toBe('الاتجاه')
        expect(
            (translated.config.items[1].item as { content: string }).content
        ).toBe('<p>مرحبا</p>')
    })

    it('does not touch layouts and styles', () => {
        const translated = translateConfig(visualizationModule, dictionary)
        expect(translated.config.layouts).toBe(
            visualizationModule.config.layouts
        )
        const translatedAppearance = translateConfig(appearance, dictionary)
        expect(translatedAppearance.header.title.style.align).toBe('left')
    })

    it('translates the header, footer and links of the appearance', () => {
        const translated = translateConfig(appearance, dictionary)
        expect(translated.header.title.text).toBe('البوابة الصحية')
        expect(translated.header.subtitle.text).toBe('Public data')
        expect(translated.footer.footerItems[0].title).toBe('روابط')
        expect(translated.footer.footerItems[0].links[0].name).toBe(
            'دي إتش آي إس 2'
        )
        expect(translated.footer.footerItems[0].links[0].url).toBe(
            'https://dhis2.org'
        )
    })

    it('does not mutate the input', () => {
        const input = structuredClone(menu)
        translateConfig(input, dictionary)
        expect(input).toEqual(menu)
    })

    it('returns the same object when there are no translations', () => {
        expect(translateConfig(menu, {})).toBe(menu)
    })

    it('handles empty and primitive values', () => {
        expect(translateConfig(undefined, dictionary)).toBeUndefined()
        expect(translateConfig(null, dictionary)).toBeNull()
        expect(translateConfig('Home', dictionary)).toBe('Home')
    })
})

describe('collectTranslatableStrings', () => {
    it('lists each unique text once, with all the places it is used', () => {
        const strings = collectTranslatableStrings([
            { name: 'Menu', value: menu },
            { name: 'Malaria Surveillance', value: visualizationModule },
            {
                name: 'Home module',
                value: { id: 'home', label: 'Home', type: 'SECTION' },
            },
        ])
        const sources = strings.map(({ source }) => source)
        expect(sources).toEqual(
            expect.arrayContaining([
                'Home',
                'Malaria',
                'Cases',
                'Malaria Surveillance',
                'Malaria Case Surveillance',
                'Confirmed cases',
                'Trend',
                '<p>Welcome</p>',
            ])
        )
        expect(new Set(sources).size).toBe(sources.length)
        expect(sources).not.toContain('home')
        expect(sources).not.toContain('Z90NM1oWJCa')
        expect(sources).not.toContain('module')

        const home = strings.find(({ source }) => source === 'Home')!
        expect(home.locations).toEqual([
            ['Menu', 'items', 'Home', 'label'],
            ['Home module', 'label'],
        ])
    })

    it('ignores empty texts and layouts', () => {
        const strings = collectTranslatableStrings([
            {
                name: 'Module',
                value: {
                    title: '   ',
                    layouts: { lg: [{ i: 'x', label: 'Hidden' }] },
                },
            },
        ])
        expect(strings).toEqual([])
    })
})

describe('getTranslationDictionary', () => {
    it('returns the dictionary of the locale', () => {
        expect(
            getTranslationDictionary({ locales: { ar: { a: 'b' } } }, 'ar')
        ).toEqual({ a: 'b' })
    })

    it('returns an empty dictionary for missing configurations', () => {
        expect(getTranslationDictionary(undefined, 'ar')).toEqual({})
        expect(getTranslationDictionary({ locales: {} }, 'ar')).toEqual({})
    })
})

describe('isRichTextSource', () => {
    it('detects html content', () => {
        expect(isRichTextSource('<p>Welcome</p>')).toBe(true)
        expect(isRichTextSource('Cases < 5 and > 2')).toBe(false)
        expect(isRichTextSource('Plain text')).toBe(false)
    })
})

describe('getTranslation', () => {
    it('never resolves texts to properties inherited from Object', () => {
        for (const source of [
            'constructor',
            'toString',
            'hasOwnProperty',
            '__proto__',
        ]) {
            expect(getTranslation({}, source)).toBeUndefined()
            expect(translateText(source, { Home: 'الرئيسية' })).toBe(source)
        }
    })

    it('translates texts named like Object properties when they are translated', () => {
        const dictionary = JSON.parse('{"constructor": "المُنشئ"}')
        expect(getTranslation(dictionary, 'constructor')).toBe('المُنشئ')
        expect(
            translateConfig({ label: 'constructor' }, dictionary).label
        ).toBe('المُنشئ')
    })
})
