# AGENTS GUIDE

Vue 3 + Vite 8 subscription-converter SPA, written in TypeScript with the Composition API (`<script setup lang="ts">`). Keep changes small, follow existing patterns, avoid refactors during fixes.

This repo was migrated from upstream `CareyWang/sub-web` (JavaScript + Options API + test suite) in commit `33375da`. History and comments before that commit describe code that no longer exists — trust the current tree, not old commits or stale docs. Domain vocabulary lives in [CONTEXT.md](CONTEXT.md); read it before touching subscription-generation logic.

## Quick Facts

- Vue 3.5, `<script setup lang="ts">` everywhere; Options API is gone
- Vite 8 (rolldown-based bundler). TypeScript is **transpile-only**: no `tsconfig.json`, no `vue-tsc`, no type-check step — `pnpm build` is the only automated gate
- UI: Element Plus 2 on demand via `unplugin-auto-import` + `unplugin-vue-components` (ElementPlusResolver)
- Router: Vue Router 5 (`createWebHistory(import.meta.env.BASE_URL)`), single route `/` → `views/Subconverter.vue`
- PWA: `vite-plugin-pwa` (generateSW, autoUpdate) + `src/registerServiceWorker.ts`
- Node 24, package manager **pnpm** (Dockerfile, `build.cmd` and CI all use pnpm 10)
- No lint / unit-test / e2e tooling in this repo (removed in the migration; do not reintroduce without approval)

## Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies (creates `pnpm-lock.yaml`, which is gitignored) |
| `pnpm dev` | Dev server (Vite default port 5173) |
| `pnpm build` | Production build → `dist/` |
| `pnpm preview` | Preview `dist/` locally |
| `build.cmd` | Windows helper: `pnpm install` + `pnpm run build` (raises node max-old-space) |

## CI / Workflows

Both workflows trigger on push to `main` (`paths-ignore: docs/**` to prevent loops) and on `workflow_dispatch`:

- **build.yml**: pnpm build → upload `dist/` artifact → dispatch `LM-Firefly/subconverter` repo's `submodule.yml` (ref `simpleweb`) via the `REPO_TOKEN` secret
- **pages.yml** ("Update sub-web"): builds with `VITE_BASE=/sub-web/`, moves `dist/` into `docs/`, replaces the `cloudflare_analytics_token` placeholder in `index.html` with the real Cloudflare Web Analytics token, commits `docs/` (Cloudflare Pages serves this folder), then dispatches this repo's `build.yml`
- **dependabot.yml**: weekly updates for `github-actions` and npm

`docs/` is committed build output owned by CI — never hand-edit it.

## Repository Layout

```
index.html                    # Entry HTML (loads /src/main.js — Vite resolves it to main.ts)
vite.config.ts                # base from VITE_BASE, manualChunks (vue/axios), @ → src alias
Dockerfile                    # node:24-alpine build → nginx:1.24-alpine static hosting
build.cmd                     # Windows: pnpm install && pnpm run build
.env                          # committed build-time VITE_* config
CONTEXT.md                    # domain vocabulary (source subscription, tri-state, generated link, …)
src/
├── main.ts                   # bootstrap: router + registerPlugins + mount
├── App.vue                   # el-config-provider (zh-cn locale) + router-view
├── registerServiceWorker.ts  # virtual:pwa-register, autoUpdate + refresh prompt
├── auto-imports.d.ts         # generated (unplugin-auto-import) — do not edit
├── components.d.ts           # generated (unplugin-vue-components) — do not edit
├── views/Subconverter.vue    # the only page; reads most env vars directly
├── components/
│   ├── PrivacyNotice.vue     # fixed alert, auto-dismiss after 5s
│   ├── TriStateCheckbox.vue  # tri-state toggle: 默认(null) → 开(true) → 关(false)
│   ├── UrlParseDialog.vue    # import dialog: URL → parseConfigParams → form
│   └── SvgIcon/index.vue     # icon-class → ?raw SVG map (github/telegram/clash)
├── composables/
│   ├── useSubconverter.ts    # form state + makeUrl + install deep links + custom params
│   ├── useBackend.ts         # backend version fetch (alert on failure)
│   └── useOptions.ts         # aggregates clientTypes / remoteConfigs / backend presets
├── config/
│   ├── constants.ts          # customBackendDirectives (backend presets) + clashDnsOptions
│   ├── client-types.ts       # label → { target, ver? }
│   └── remote-configs.ts     # grouped el-option data
├── services/backendService.ts  # getBackendVersion, fetchConfig
├── utils/
│   ├── formatters.ts         # TriState type + buildUrlParams (URL generation rules)
│   ├── search.ts             # parseConfigParams (URL import rules — not a search helper)
│   ├── validators.ts         # validateSubUrl, validateRequiredFields → { valid, message }
│   ├── storage.ts            # TTL localStorage { setTime, ttl, expire, value }
│   ├── index.ts              # copyToClipboard (the live one)
│   └── clipboard.js          # copyText — UNUSED legacy duplicate
├── plugins/
│   ├── index.ts              # registerPlugins: svg-icon + Element Plus icon components
│   ├── element-plus.js       # setupElementPlus — UNUSED dead code
│   └── vite-plugins.ts       # createVitePlugins: vue / AutoImport / Components / PWA
├── icons/svg/                # SVG sources (?raw imports)
└── assets/css/notify.css
public/
├── favicons/                 # real favicon set + site.webmanifest
├── _redirects                # SPA fallback /* → /index.html (Pages/Netlify)
└── robots.txt
docs/                         # CI-committed build output (Cloudflare Pages)
.github/workflows/            # build.yml, pages.yml; dependabot.yml
```

## Key Modules

### `src/composables/useSubconverter.ts`
`useSubconverter(defaultBackend)` returns `form`, `advanced` (`'1'` basic / `'2'` advanced, **default `'1'`**), `customParams`, `customSubUrl`, computed `canMakeUrl` / `canInstall` / `domainSet`, and methods `makeUrl`, `saveSubUrl`, `clashInstall`, `surgeInstall`, `addCustomParam`, `removeCustomParam`, `checkRequired`. Spread nothing here — the view destructures what it needs. `surgeInstall` is defined but not wired into the view.

### `src/utils/formatters.ts`
`buildUrlParams(form, advanced, customParams, defaultBackend)` owns URL generation and returns `{ backend, queryParams }`. Rules worth knowing:

- `backend` is `form.customBackend || defaultBackend`; values end with `?` (presets end with `/sub?`). The view builds the default as `VITE_SUBCONVERTER_DEFAULT_BACKEND + "/sub?"` (plain concatenation, no normalization)
- Tri-state fields (`TriState = boolean | null`): `null` → param omitted (backend default wins), `true`/`false` → explicit
- Special case: `emoji === false` is sent as `add_emoji=false&remove_emoji=false` (backend treats `emoji=false` as "strip existing emoji")
- `classic` is shown inverted in the UI as `domainSet` (checked = domain-set = `classic=false`); watchers keep `expand` / `nodeList` / `classic` mutually consistent — preserve them when touching these
- Simple targets (`ss`/`ssd`/`ssr`/`sssub`/`v2ray`/`trojan`/`mixed`) get no rule params (`expand`/`classic`/`list` are skipped)
- Clash-only: `new_name` (tri-state), `clash.dns`; QuanX-only: `dev_id`; `agekey` is target-independent

Keep `buildUrlParams` (generation) and `parseConfigParams` (import) in sync whenever you add or rename a parameter.

### `src/utils/search.ts`
`parseConfigParams(url)` → `{ formUpdates, customParams }` — the import path (the filename is historical). Query params not in its mapping become `customParams`. `url` becomes `sourceSubUrl` with `|` → newline; clientType is rebuilt as `{ target, ver? }` with legacy Surge `ver` 2/3 normalized to `4`; `customBackend` becomes `origin + pathname + "?"`. Absent params are not touched (the dialog `Object.assign`s updates into the existing form). Driven by `UrlParseDialog.vue`, which resolves short/redirect links first via `fetchConfig`.

### `src/config/*` + `src/composables/useOptions.ts`
`constants.ts` = backend preset map (`customBackendDirectives`) + `clashDnsOptions`. `client-types.ts` = label → `{ target, ver? }`. `remote-configs.ts` = grouped option data. `useOptions()` aggregates them and trims labels on phone user agents.

### `src/services/backendService.ts`
`getBackendVersion(backendUrl)` assumes the URL ends with `/sub?` (strips the last 5 chars, GETs `/version`). `fetchConfig(url)` follows redirects and returns the final `response.url`. Version fetch failures alert via `ElMessageBox` (in `useBackend.ts`); that is the only place a fetch error is surfaced.

### `src/utils/storage.ts`
TTL localStorage wrapper; TTL from `import.meta.env.VITE_CACHE_TTL` (default `3600`). Only used for `sourceSubUrl` and only when `VITE_USE_STORAGE === 'true'` (strict string compare) — see `Subconverter.vue` `onMounted`.

### `src/utils/validators.ts`
`validateSubUrl` / `validateRequiredFields` return `{ valid, message }` (or `{ valid: true }`); never throw. `checkRequired` in `useSubconverter` displays the message via `ElMessage.error`.

## Auto-imports & Icons

- `unplugin-auto-import` supplies Vue/vue-router APIs and `ElMessage` / `ElMessageBox` / `ElNotification` as globals (`src/auto-imports.d.ts`). `unplugin-vue-components` auto-registers components (`src/components.d.ts`). Existing code still explicitly imports `ref`/`computed`/… from `vue` and local components — match the surrounding file
- There is no `$message` / `$notify` on `app.config.globalProperties`: `plugins/element-plus.js` is dead code, never called
- `<svg-icon icon-class="github" />` renders from `svgMap` in `SvgIcon/index.vue` (imports `?raw` from `src/icons/svg/`); add an icon by adding the `.svg` file plus a `svgMap` entry
- Element Plus icon components (by `icon.name`) are globally registered in `plugins/index.ts`; use them as `<el-icon><Operation /></el-icon>`, no `el-icon-*` font classes

## Environment Variables

Build-time only (`VITE_` prefix via `import.meta.env`), baked in at build — this fork has **no** runtime `window.__SUB_WEB_CONFIG__` mechanism. Read sites:

- `src/views/Subconverter.vue` — most `VITE_*` links and `VITE_SUBCONVERTER_DEFAULT_BACKEND`
- `src/utils/storage.ts` — `VITE_CACHE_TTL`
- `vite.config.ts` — `VITE_BASE` (plain `process.env`, for subpath builds: `VITE_BASE=/sub-web/ pnpm build`)

`.env` is committed (only `.env.local` / `.env.*.local` are ignored). `VITE_MYURLS_API` and `VITE_CONFIG_UPLOAD_API` appear only as comments in `.env` — the upstream short-link and config-upload features are gone; do not reference them. New env vars: add them to `.env` and read them where similar ones are read (do not invent a central constants layer).

## Docker

- Multi-stage: `node:24-alpine` (build) → `nginx:1.24-alpine` serving `dist/`; no entrypoint config generator, env is baked at build time
- Known issue: the build stage runs `pnpm install --frozen-lockfile` after `COPY package*.json ./`, but `pnpm-lock.yaml` is gitignored and not matched by that glob — a clean `docker build` fails unless the lockfile is copied in or `--frozen-lockfile` is dropped
- The image contains only the frontend; the subconverter backend runs separately

## Known Quirks / Dead Code

- `index.html` loads `/src/main.js`; Vite resolves it to `src/main.ts` — leave the reference as-is
- `src/utils/clipboard.js` (`copyText`) is unused; the live helper is `copyToClipboard` in `src/utils/index.ts`
- `src/utils/search.ts` is URL-import parsing, not search
- `src/plugins/element-plus.js` is unused (Element Plus comes entirely from the unplugins)
- PWA manifest icons point at `/icons/*.png`, which don't exist (real assets are in `public/favicons/`); `registerServiceWorker.ts` has the same stale path in its notification icon
- No `tsconfig.json`: broken types still build; review types by eye

## Code Style

- 2-space indent; prefer single quotes; most `.ts` files use semicolons — match the file you edit
- SFC structure: `<template>` / `<script setup lang="ts">` / `<style scoped>`
- Composition API only; do not reintroduce Options API
- UI strings are Chinese
- Keep network calls in `src/services/`; user-facing validation in `src/utils/validators.ts` (return values, no throws)

## Git Hygiene

- `pnpm-lock.yaml` is intentionally gitignored — do not commit it
- `docs/` is CI-committed output; changes there come from `pages.yml`
- Do not commit `dist/`, `node_modules/`, `.env.local`, `.env.*.local`, or generated `auto-imports.d.ts` / `components.d.ts` edits beyond what the unplugins regenerate

## Verification

There is no test runner. Before considering a change done:

- `pnpm build` must pass (this is the only automated gate)
- `pnpm dev` and smoke the golden path: generate a subscription URL, copy it, re-import it via the dialog (round-trip must restore the form), toggle tri-state options and confirm the query string, switch backend and see the version refresh
- For URL-parameter changes, verify both `buildUrlParams` and `parseConfigParams` stay symmetric
- Docker changes: build the image and smoke `/` (mind the lockfile caveat above)

## Notes for Agents

- Minimise scope; no large refactors unless explicitly requested
- Do not introduce `tsconfig.json`, type-checking, lint or test tooling without approval
- Do not resurrect upstream-era modules (`useSubscription.js`, short URL service, config upload dialog, runtime config) — they were deliberately removed
- Prefer editing existing files; follow the patterns in neighboring code
