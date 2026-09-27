import { z } from 'zod'

/*
 * Translations of the texts configured in the manager (menu labels, module titles, descriptions, rich text...).
 *
 * The texts are configured in the source language (English) and each translation is stored against the exact
 * source text, per locale:
 *
 * {
 *     "locales": {
 *         "ar": {
 *             "Home": "الرئيسية",
 *             "Malaria Surveillance": "ترصد الملاريا"
 *         }
 *     }
 * }
 *
 * When a source text changes, its translation no longer matches and the portal falls back to the source text.
 * */

export const translationDictionarySchema = z.record(z.string(), z.string())

export type TranslationDictionary = z.infer<typeof translationDictionarySchema>

export const contentTranslationsConfigSchema = z.object({
    locales: z.record(z.string(), translationDictionarySchema),
})

export type ContentTranslationsConfig = z.infer<
    typeof contentTranslationsConfigSchema
>
