import localFont from 'next/font/local'

/*
 * Noto Sans Arabic (SIL Open Font License 1.1, see ./noto-sans-arabic/OFL.txt), self-hosted so that builds do not
 * depend on an external font service.
 *
 * The font is limited to the Arabic unicode ranges: latin texts keep using the default font, and browsers only
 * download the font files when a page contains arabic characters.
 * */
export const arabicFont = localFont({
    src: [
        {
            path: './noto-sans-arabic/noto-sans-arabic-arabic-400-normal.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './noto-sans-arabic/noto-sans-arabic-arabic-500-normal.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: './noto-sans-arabic/noto-sans-arabic-arabic-700-normal.woff2',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-arabic',
    display: 'swap',
    preload: false,
    adjustFontFallback: false,
    declarations: [
        {
            prop: 'unicode-range',
            value: 'U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC',
        },
    ],
})
