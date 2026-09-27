# DHIS2 FlexiPortal: Arabic Edition

A bilingual (**English / العربية**) edition of [DHIS2 FlexiPortal](https://github.com/hisptz/dhis2-public-portal), the
public portal for sharing DHIS2 visualizations, documents and content with the public (winner of the DHIS2 Annual
Conference 2025 App Competition).

Visitors switch the portal between English and Arabic with a button in the header. In Arabic, the whole portal is
displayed from right to left: menu, header, footer, filters, tables and the layout of the visualizations.

> Based on **hisptz/dhis2-public-portal v1.6.1** by HISP Tanzania (BSD 3-Clause License, see [LICENSE](./LICENSE)).

---

## Contents

- [What the Arabic Edition adds](#what-the-arabic-edition-adds)
- [Documentation](#documentation)
- [Install and setup](#install-and-setup)
- [Environment variables](#environment-variables)
- [Development](#development)
- [Project status (where we left off)](#project-status-where-we-left-off)
- [Credits and license](#credits-and-license)

---

## What the Arabic Edition adds

| Feature                         | Description                                                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Language switch**             | Header button to switch English ⇄ العربية. The choice is remembered by the browser. Default language configurable (`DEFAULT_LOCALE`).     |
| **Arabic portal texts**         | Every text of the portal itself (buttons, filters, messages, period names, errors) is available in Arabic.                                |
| **Translations page (Manager)** | Administrators translate everything they configured: portal name, header, footer, menu, module titles, descriptions, captions, rich text. |
| **Translated DHIS2 metadata**   | Chart titles, data items, organisation units and levels are shown with their Arabic translations from DHIS2.                              |
| **Arabic period names**         | "سبتمبر 2025", "يناير - مارس 2025", "آخر 12 شهرًا"… in charts, tables and period filters.                                                 |
| **Right-to-left layout**        | Mirrored layout, mirrored dashboard grid, RTL tables, filters and menus, mobile menu, bundled Arabic font.                                |
| **Safe fallback**               | Anything not translated yet is shown in English and displayed correctly inside the Arabic layout.                                         |
| **Security fixes**              | Fixed a pre-existing `/api` proxy whitelist bypass and excluded `.env` files (DHIS2 token) from Docker builds.                            |

Existing FlexiPortal configurations work as they are: no migration is needed, and configuration export/import includes
the translations.

---

## Documentation

| Document                                                                           | For                                                                     |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [How it works](./How%20it%20works.md)                                              | Technical explanation of how the Arabic Edition was built, and why      |
| [ARABIC_EDITION_CHANGES.md](./ARABIC_EDITION_CHANGES.md)                           | Every file added or changed, with the reason                            |
| [Languages and Translations](./apps/docs/docs/configuration/translations/index.md) | User guide for administrators                                           |
| [Documentation site sources](./apps/docs/docs)                                     | Original FlexiPortal documentation (configuration, modules, deployment) |
| [CLAUDE.md](./CLAUDE.md)                                                           | Developer notes on the codebase and conventions                         |

Repository layout:

| Folder            | Content                                                                        |
| ----------------- | ------------------------------------------------------------------------------ |
| `apps/portal`     | The public portal (Next.js 16, server-rendered)                                |
| `apps/manager`    | FlexiPortal Manager, the DHIS2 app used to configure the portal                |
| `apps/docs`       | Documentation site (Docusaurus)                                                |
| `packages/shared` | Code shared by the portal and the Manager (schemas, translation logic, charts) |
| `services`        | Optional data service (unchanged)                                              |

---

## Install and setup

> **Important:** the prebuilt images and zips of the original project (`hisptanzania/dhis2-public-portal` on Docker
> Hub, the App Hub version of the Manager, the upstream GitHub releases) do **not** contain the Arabic Edition. Build
> the portal and the Manager from this repository as described below.

### Requirements

- A DHIS2 instance, **2.40 – 2.42** (tested on 2.42.5.1), and a superuser account to set it up
- To build: **Node.js 20+** and **pnpm 10** (`corepack enable` installs the right version), or **Docker**
- A server to run the portal (Docker, or Node.js with PM2)

### 1. Prepare DHIS2: a read-only user and token for the portal

The portal reads DHIS2 with a **Personal Access Token (PAT)** of a dedicated low-privilege user. Full guide:
[DHIS2 access settings](./apps/docs/docs/configuration/dhis2-access-settings/index.md). In short:

1. **Users app → User role → New**, e.g. `Public Portal Access`, with the authorities:
    - `App: Dashboard`, `App: Data visualizer app`
    - `View event analytics` (`F_VIEW_EVENT_ANALYTICS`), only if you publish program indicator / event data
2. **Users app → User → New**, e.g. `public.portal`, with that role and the organisation units whose data is public
   (both _data capture_ and _data view_ organisation units).
3. Share the visualizations, maps and their data items with this user (or make them publicly readable).
4. Log in as `public.portal` → **Edit profile → Personal access tokens → Generate new token**:
   context _Server/script_, allowed methods **GET** only (add POST only if you use the feedback form).
   Copy the token, it is shown only once.

### 2. Build and install the Manager

```bash
git clone <this-repository-url> flexiportal-arabic
cd flexiportal-arabic
corepack enable
pnpm install
pnpm --filter manager build
```

This creates `apps/manager/build/bundle/hisptz-flexiportal-manager-<version>.zip`. In DHIS2, open
**App Management → Manual install** and upload that zip (it replaces an existing FlexiPortal Manager).

> After upgrading the Manager, refresh the browser (Ctrl+Shift+R) if the new **Translations** menu does not appear.

### 3. Deploy the portal

Choose one of the options below. The portal must be able to reach the DHIS2 URL.

#### Option A: Docker (recommended)

From the repository root:

```bash
docker build -t flexiportal-arabic .

docker run -d --name flexiportal -p 3000:3000 \
  -e DHIS2_BASE_URL=https://your-dhis2.example.org \
  -e DHIS2_BASE_PAT_TOKEN=d2p_your_token \
  -e DEFAULT_LOCALE=en \
  --restart unless-stopped \
  flexiportal-arabic
```

For a portal served under a sub path (e.g. `https://example.org/portal`), add
`--build-arg NEXT_PUBLIC_CONTEXT_PATH=/portal` to `docker build`.

#### Option B: Node.js / PM2

```bash
pnpm install
pnpm --filter portal build

# assemble the standalone server
mkdir -p ../flexiportal-server
cp -r apps/portal/.next/standalone/. ../flexiportal-server/
cp -r apps/portal/.next/static ../flexiportal-server/apps/portal/.next/static
rm -f ../flexiportal-server/apps/portal/.env   # never ship a local .env with a token

cd ../flexiportal-server
DHIS2_BASE_URL=https://your-dhis2.example.org \
DHIS2_BASE_PAT_TOKEN=d2p_your_token \
PORT=3000 node apps/portal/server.js
```

To keep it running, use PM2 with `apps/portal/pm2.config.js` and set the variables in the PM2 environment.
Put a reverse proxy (Nginx, Apache…) with HTTPS in front of the portal in production.

#### Option C: development mode (local testing only)

```bash
cp apps/portal/.env.example apps/portal/.env   # then set DHIS2_BASE_URL and DHIS2_BASE_PAT_TOKEN
pnpm dev:portal                                # http://localhost:3000
```

### 4. Configure the portal

1. Open **FlexiPortal Manager** in DHIS2. On first use choose **Setup default configuration** (or **Import
   Configuration** with an exported zip).
2. **General**: portal name, description, icon and _Application URL_ (the public URL of the portal).
3. **Appearance**: colors, header, footer.
4. **Modules**: create modules (e.g. a _Visualization_ module) and add your charts, tables, maps.
5. **App Menu**: add the modules to the menu.

See the [configuration documentation](./apps/docs/docs/configuration/intro.md) for every option.

### 5. Translate to Arabic

1. **DHIS2 metadata**: in the DHIS2 **Translations** app (or **Maintenance → Translate**), add Arabic names (`ar`)
   for the published visualizations and maps, their data elements / indicators / program indicators, the
   organisation units and organisation unit levels.
2. **Configured texts**: in **FlexiPortal Manager → Translations**, select _العربية_, translate each text
   (use _Show untranslated texts only_ to find what is left), then **Save translations**.
3. Open the portal and click **العربية** in the header.

Texts without a translation are shown in English. See
[Languages and Translations](./apps/docs/docs/configuration/translations/index.md).

### 6. Check the installation

- `https://your-portal/api/info` returns the portal version.
- Both languages load, charts show data, and the location filter lists your organisation units.
- If charts of program indicators show an error mentioning `E7217`, give the portal user the
  `View event analytics` authority.

---

## Environment variables

| Variable                   | Required | Description                                                                                             |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `DHIS2_BASE_URL`           | Yes      | URL of the DHIS2 instance (e.g. `https://dhis2.example.org`)                                            |
| `DHIS2_BASE_PAT_TOKEN`     | Yes      | Personal Access Token of the portal user (GET only)                                                     |
| `DEFAULT_LOCALE`           | No       | Language for visitors who have not chosen one: `en` (default) or `ar`                                   |
| `NEXT_PUBLIC_CONTEXT_PATH` | No       | Sub path when the portal is not served at the root. **Build time** variable (rebuild after changing it) |

---

## Development

```bash
pnpm install
pnpm dev:portal        # portal on http://localhost:3000 (needs apps/portal/.env)
pnpm dev:manager       # manager on http://localhost:3001 (needs apps/manager/.env with DHIS2_PROXY_URL)

pnpm check-types       # TypeScript
pnpm lint:check        # ESLint
pnpm format:check      # Prettier
pnpm test -- --run     # unit tests (Vitest)
pnpm build             # build everything
```

Rules for contributors (details in [CLAUDE.md](./CLAUDE.md) and [How it works](./How%20it%20works.md)):

- Never hard-code visitor-facing text in the portal: add it to **both** `apps/portal/messages/en.json` and
  `apps/portal/messages/ar.json` (a test fails otherwise).
- Use logical CSS (`margin-inline-start`, Tailwind `ms-*`/`start-*`/`end-*`, `rtl:`) instead of left/right.
- Configuration texts shown to visitors must go through `localizeContent()` on the server.
- Only add resources to the `/api` proxy whitelist in `apps/portal/src/utils/api/proxy.ts`, with tests.

---

## Project status (where we left off)

_Last updated: 2026-09-27._

**Status: complete and verified.** The Arabic Edition is feature-complete for the portal and the Manager.

What was verified:

- `pnpm check-types`, `pnpm lint:check`, `pnpm format:check`: passing for portal, manager and shared.
- `pnpm test`: 1,594 unit tests passing (51 added by the Arabic Edition).
- Production builds of the portal (standalone server, same as Docker), the Manager and the docs site.
- Automated smoke test against the production server: every module page in both languages, cookie fallback,
  translated DHIS2 metadata and periods through the proxy, proxy bypass attempts refused, and 200 concurrent
  mixed English/Arabic requests without any page served in the wrong language.
- Manual browser testing on DHIS2 2.42.5.1 (desktop and phone width): column chart, pivot table, single value,
  grouped modules, side-by-side layouts, static pages, period and location filters, org unit tree, menus, footer,
  and the full Manager Translations workflow (plain and rich text, first save, discard).

Test environment used during development (local only, not part of the repo): a DHIS2 2.42.5.1 Docker instance, a
`public.portal` user with a GET-only PAT, the Manager installed from this repository, a _Malaria Surveillance_
visualization module plus two test modules (a grouped _Malaria Dashboard_ and a static _Resources_ module), and Arabic
translations of the demo metadata.

Repository notes:

- Created as a fresh repository (single initial commit) from the upstream code; the upstream project is credited
  above and in [LICENSE](./LICENSE).
- The GitHub Actions workflows inherited from upstream (`.github/workflows`) are **disabled** in this repository:
  they publish releases with semantic-release, push Docker images to `hisptanzania/*` and deploy the docs. Review them
  (image names, App Hub, secrets) before re-enabling Actions in the repository settings.

Known limitations:

- A configured-text translation is tied to its exact English text; editing the English text requires re-translating
  it (the Manager lists translations that are no longer used).
- Month names use the standard Arabic forms (يناير، فبراير…) with Western digits.
- The Manager's own screens are in English; only the public portal is bilingual.

Pre-existing upstream behaviour worth knowing:

- On phones, a large header title plus logo (Appearance settings) can overflow the header: use a shorter title or a
  smaller text size.
- The default configuration references a portal icon document that does not exist on a new DHIS2 instance (the
  favicon returns an error until an icon is uploaded in **General**).
- `docker/docker-compose-build.yml` uses paths relative to the repository root; use the `docker build` command above.

Possible next steps:

- Levantine month names (كانون الثاني…) or Arabic-Indic digits, if preferred by the users.
- Arabic translation of the Manager's own interface.
- Configure CI (own Docker image name, secrets) and re-enable GitHub Actions.
- End-to-end (Cypress) tests for the Arabic portal.

---

## Credits and license

- Original project: [DHIS2 FlexiPortal](https://github.com/hisptz/dhis2-public-portal) by
  [HISP Tanzania](https://hisp.tz), BSD 3-Clause License. The original license and copyright notice are kept in
  [LICENSE](./LICENSE).
- Arabic font: [Noto Sans Arabic](https://github.com/notofonts/arabic), SIL Open Font License 1.1
  (`apps/portal/src/fonts/noto-sans-arabic/OFL.txt`).
- Arabic Edition: Abdelatif Abualya.
