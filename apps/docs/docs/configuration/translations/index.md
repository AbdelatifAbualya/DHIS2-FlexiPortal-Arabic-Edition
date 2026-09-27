---
sidebar_position: 6
---

# Languages and Translations

The portal is available in **English** and **Arabic**. Visitors switch the language with the language button in the
header of the portal. The selected language is remembered by the browser (in the `NEXT_LOCALE` cookie).

When Arabic is selected, the whole portal is displayed from right to left: the menu, the header, the footer, the
filters, the tables and the layout of the visualizations.

The texts displayed by the portal come from three different places, each translated in its own way:

| Texts                                                                                                                              | Translated in                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Texts of the portal itself: buttons, filters, messages, period names...                                                            | Built into the portal                                          |
| Texts configured in the manager: portal name, header, footer, menu labels, module titles, descriptions, captions, rich text...     | The **Translations** page of the FlexiPortal Manager           |
| Names coming from DHIS2: visualization titles, data elements, indicators, organisation units, organisation unit levels, legends... | DHIS2 itself, with the **Translations** or **Maintenance** app |

## Translating the configured texts

1. Open the FlexiPortal Manager and go to the **Translations** page.
2. Select the language to translate to.
3. Enter the translation of each text in the **Translation** column.
    - Rich text content (for example the home page welcome note or static items) is translated with a rich text
      editor. The editor starts from the english content, so that its formatting is kept and only the texts need to be
      translated.
    - Use **Show untranslated texts only** to focus on the texts that still need a translation.
4. Click **Save translations**.

The changes are visible in the portal after reloading the page.

:::info
Translations are linked to the english text. When an english text is changed in the manager, its previous translation
no longer applies and the english text is displayed until a new translation is saved. The Translations page lists
translations that are no longer used so that they can be removed.
:::

Texts that are not translated are displayed in english.

The translations are saved in the DHIS2 datastore (namespace `hisptz-public-portal`, key `translations`) and are
included in the configuration export/import.

## Translating DHIS2 metadata

Titles of visualizations and maps, names of data items (data elements, indicators, program indicators...) and
organisation units are shown exactly as DHIS2 returns them in the selected language. Add the Arabic translations of
this metadata in DHIS2, using the **Translations** app or the **Translate** option of the **Maintenance** app. Metadata
without a translation is displayed with its default name.

Period names (for example `September 2025`, `Last 12 months`) and the texts of the charts, tables and filters are
translated by the portal.

## Default language

The portal is displayed in english to visitors who have not selected a language yet. To use Arabic by default, set the
`DEFAULT_LOCALE` environment variable of the portal:

```bash
DEFAULT_LOCALE=ar
```
