# Arabic Edition: list of changes

This file lists every change made to [hisptz/dhis2-public-portal](https://github.com/hisptz/dhis2-public-portal)
**v1.6.1** to create the Arabic Edition. For _how_ the pieces work together, read [How it works](./How%20it%20works.md).

## Summary

| Area             | Change                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Portal languages | English / Arabic switch in the header, remembered in the `NEXT_LOCALE` cookie; optional `DEFAULT_LOCALE` env variable                            |
| Portal texts     | All portal texts moved to `messages/en.json` and `messages/ar.json` (next-intl)                                                                  |
| Configured texts | New translation dictionary (datastore key `hisptz-public-portal/translations`) applied to menus, header, footer, modules, static items, metadata |
| Manager          | New **Translations** page to translate the configured texts                                                                                      |
| DHIS2 metadata   | Visualization, map, analytics and org unit requests ask DHIS2 for translated names (`translate=true&locale=…`)                                   |
| Periods          | Period, relative period, period type and dimension names translated by the portal                                                                |
| Chart libraries  | Arabic texts for `@hisptz/dhis2-analytics` / `@hisptz/dhis2-ui` (switched in the browser only)                                                   |
| Right-to-left    | `dir="rtl"`, Mantine direction, logical CSS, mirrored dashboard grid, LTR-only Leaflet maps, `dir="auto"` for untranslated content, Arabic font  |
| Security         | `/api` proxy whitelist fixed (pre-existing bypass); `.dockerignore` now excludes `.env` files at any depth                                       |
| Tests            | 51 new unit tests (content translation, messages parity, periods, analytics, grid mirroring, proxy whitelist)                                    |
| Documentation    | `How it works.md`, this file, README, user docs page _Languages and Translations_, deployment env tables, `CLAUDE.md` developer notes            |

## New files

### Shared package (`packages/shared`)

| File                             | Purpose                                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/constants/i18n.ts`          | Supported locales (`en`, `ar`), RTL locales, cookie name, labels, direction helper                 |
| `src/schemas/translations.ts`    | Zod schema of the translations dictionary stored in the datastore                                  |
| `src/utils/translations.ts`      | `translateConfig`, `collectTranslatableStrings`, `getTranslation` (used by the portal and Manager) |
| `src/utils/translations.test.ts` | Unit tests                                                                                         |

### Portal (`apps/portal`)

| File                                                                        | Purpose                                                                                |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `messages/en.json`, `messages/ar.json`                                      | All portal UI texts in English and Arabic                                              |
| `src/i18n/locale.ts`                                                        | Reads the visitor's language from the cookie (fallback `DEFAULT_LOCALE`, then English) |
| `src/i18n/request.ts`                                                       | next-intl request configuration                                                        |
| `src/i18n/messages.ts`                                                      | Loads messages; missing Arabic messages fall back to English                           |
| `src/i18n/next-intl.d.ts`                                                   | Type-checked message keys                                                              |
| `src/i18n/library/`                                                         | Arabic texts for the chart / org unit tree libraries and browser-only language switch  |
| `src/i18n/messages.test.ts`                                                 | Checks both message files have the same keys and placeholders                          |
| `src/utils/i18n/content.ts`                                                 | `localizeContent()`: applies the datastore translations to configurations              |
| `src/utils/i18n/dhis2.ts`                                                   | `translate=true&locale=…` parameters for DHIS2 requests                                |
| `src/utils/i18n/periods.ts`                                                 | Localized period, period type and category names                                       |
| `src/utils/i18n/analytics.ts`                                               | Localizes period and dimension names in analytics responses                            |
| `src/utils/i18n/*.test.ts`                                                  | Unit tests                                                                             |
| `src/hooks/periods.ts`                                                      | React hook exposing the period helpers                                                 |
| `src/components/LanguageSwitcher.tsx`                                       | Header language button                                                                 |
| `src/utils/layout.ts` (+ test)                                              | Mirrors dashboard grid layouts for RTL                                                 |
| `src/utils/api/proxy.ts` (+ test)                                           | Strict whitelist for the `/api` proxy                                                  |
| `src/fonts/arabic.ts`, `src/fonts/family.ts`, `src/fonts/noto-sans-arabic/` | Bundled Noto Sans Arabic font (OFL license included), limited to Arabic characters     |
| `vitest.config.mts`                                                         | Lets unit tests resolve the `@/` import alias                                          |

### Manager (`apps/manager`)

| File                                      | Purpose                                        |
| ----------------------------------------- | ---------------------------------------------- |
| `src/modules/translations/index.tsx`      | `/translations` route                          |
| `src/shared/components/TranslationsPage/` | Translations page, rich text modal, data hooks |

### Documentation

| File                                                 | Purpose                                     |
| ---------------------------------------------------- | ------------------------------------------- |
| `How it works.md`                                    | Technical explanation of the Arabic Edition |
| `ARABIC_EDITION_CHANGES.md`                          | This file                                   |
| `apps/docs/docs/configuration/translations/index.md` | User guide: Languages and Translations      |

## Modified files

### Shared package

| File                                                                   | Change                                                                       |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/constants/datastore.ts`                                           | New `DatastoreKeys.TRANSLATIONS` (so Export/Import includes translations)    |
| `src/constants/index.ts`, `src/schemas/index.ts`, `src/utils/index.ts` | Export the new modules                                                       |
| `src/components/visualizations/YearOverYearVisualizer.tsx`             | Optional `getPeriodName` prop for localized period names (default unchanged) |

### Portal

| File(s)                                                                                                                                                         | Change                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `next.config.ts`                                                                                                                                                | next-intl plugin                                                                                        |
| `package.json`                                                                                                                                                  | `next-intl` 4.14.7 and `@dhis2/d2-i18n` 1.2.0 (was used but not declared)                               |
| `types/index.d.ts`                                                                                                                                              | `locale` option of `@dhis2/multi-calendar-dates`                                                        |
| `src/app/layout.tsx`                                                                                                                                            | `lang`/`dir` on `<html>`, next-intl provider, Arabic font                                               |
| `src/app/global-error.tsx`, `src/components/DHIS2ConnectionError.tsx`                                                                                           | Translated, RTL-aware error pages (connection errors now have a `code`, `src/types/connection.ts`)      |
| `src/app/api/[...path]/route.ts`                                                                                                                                | Strict whitelist; locale parameters; localized analytics; `Vary: Cookie`                                |
| `src/app/modules/…`, `src/app/preview/…`                                                                                                                        | Translated errors; app metadata loaded through `getAppMeta()`                                           |
| `src/components/Providers.tsx`, `src/utils/theme.ts`                                                                                                            | Mantine `DirectionProvider`, font stack, library language sync                                          |
| `src/components/Header/Header.tsx`                                                                                                                              | Language switcher, translated alt/aria texts                                                            |
| `src/components/MainLayout.tsx`, `src/components/AppMenu/…`, `src/components/Footer/…`                                                                          | Logical (RTL-safe) CSS, direction-aware tooltip, translated texts                                       |
| `src/components/FlexibleLayoutContainer.tsx`, `FlexibleLayoutItem.tsx`                                                                                          | Mirrored grid in a `dir="ltr"` container, items restore the direction                                   |
| `src/components/RichContent.tsx`, `CaptionPopover.tsx`, `Footer/components/FooterStaticContent.tsx`, `modules/StaticModule/components/StaticItemCard.tsx`       | `dir="auto"` so untranslated text reads correctly                                                       |
| `src/components/displayItems/…`, `src/components/modules/…`, `src/components/Global*Filter.tsx`, `src/hooks/dataVisualization.tsx`, error/empty/not-found pages | Hard-coded English replaced by message keys; localized periods; direction-aware menus; Leaflet kept LTR |
| `src/components/displayItems/visualizations/DataVisualization.tsx`, `MapVisualization.tsx`, `HighlightedValueDisplay.tsx`, `BannerVisualization.tsx`            | DHIS2 requests in the visitor's language; chart title uses the translated `displayName`                 |
| `src/utils/config/appConfig.ts`, `src/utils/module.ts`, `src/utils/appMetadata.ts`, `src/utils/moduleMetadata.ts`, `StaticItemsList.tsx`, `DetailsPage.tsx`     | Configurations passed through `localizeContent()`; Next.js internal errors rethrown                     |
| `src/utils/api/http.ts`                                                                                                                                         | `ignoreNotFound` option (no log noise when no translations exist yet), connection error codes           |
| `src/utils/env.ts`                                                                                                                                              | Optional `DEFAULT_LOCALE`                                                                               |

### Manager

| File                                                                  | Change                                                                                              |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `src/shared/constants/menu.ts`, `src/routeTree.gen.ts` (generated)    | Translations menu entry and route                                                                   |
| `src/shared/components/ConfigurationPage/utils/configurationUtils.ts` | Datastore save creates the key when older DHIS2 versions return 404 on update (import of a new key) |
| `i18n/en.pot` (generated)                                             | New Manager strings                                                                                 |

### Repository

| File                                                                             | Change                                                                 |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `README.md`                                                                      | Arabic Edition overview, install & setup, project status               |
| `CLAUDE.md`                                                                      | Developer notes on the i18n architecture and the proxy rule            |
| `.gitignore`                                                                     | `*.tsbuildinfo`                                                        |
| `.dockerignore`                                                                  | `.env` files excluded at any depth (the portal `.env` holds the token) |
| `pnpm-lock.yaml`                                                                 | New dependencies                                                       |
| `apps/docs/docs/deployment/portal/deploy_using_docker.md`, `deploy_to_vercel.md` | `DEFAULT_LOCALE` variable                                              |
| `apps/docs/docs/configuration/dhis2-access-settings/index.md`                    | `View event analytics` authority for program indicator data            |

## Behaviour that did not change

- Existing configurations work without any migration; nothing in the configuration schemas changed.
- With no translations saved, the Arabic portal shows the configured texts in English (with Arabic UI texts).
- The English portal looks and behaves as before, except that DHIS2 names are now explicitly requested in English.
