# Modernize syno v3.0.0

## Context

The `syno` package (Node.js wrapper + CLI for Synology DSM REST API) is written in CoffeeScript with a Grunt build pipeline, the deprecated `request` HTTP client, callback-based async, and dynamic method generation via `new Function()` + `__proto__` mutation. Version 3.0.0 will be a full rewrite to modern TypeScript targeting Node 24.

## Decisions

- **Language:** TypeScript (strict)
- **Runtime:** Node 24+ (native fetch, no polyfills)
- **Build:** tsdown (ESM + CJS dual output)
- **Tests:** Vitest
- **Async:** Promises/async-await only (no callbacks)
- **Browser:** Dropped
- **Dependencies:** 3 runtime deps (commander ^12, js-yaml ^4, pluralize ^8) — down from 9

## Bug Fixes Included

1. `SurveillanceStation.error` — `if api is 'X' or 'Y'` always truthy (CoffeeScript `or` bug)
2. CLI `execute` — missing `process.exit(1)` on unknown method (process hangs)
3. CLI `program.parse` called twice — restructured to single `parseAsync()`
4. Session SID — stored string over object, then read `._sid` on string (re-auth every call)

## Phase 1: Project Infrastructure

Set up tooling before any source rewrite.

**Create:**
- `tsconfig.json` — target ES2022, module NodeNext, strict, resolveJsonModule
- `tsdown.config.ts` — two entries: `src/index.ts` (ESM+CJS+dts) and `src/cli/index.ts` (CJS with shebang banner)
- `vitest.config.ts` — node environment, v8 coverage
- `eslint.config.js` — flat config with @typescript-eslint
- `package.json` — full rewrite:
  - `"type": "module"`
  - `"main": "./dist/index.cjs"`, `"module": "./dist/index.js"`, `"types": "./dist/index.d.ts"`
  - `"exports"` field with import/require conditions
  - `"bin": { "syno": "./dist/cli.cjs" }`
  - `"engines": { "node": ">=24.0.0" }`
  - Scripts: `build`, `dev`, `test`, `test:watch`, `lint`, `typecheck`, `clean`
  - Runtime deps: commander ^12, js-yaml ^4, pluralize ^8
  - Dev deps: typescript, tsdown, vitest, eslint, @typescript-eslint/*, @types/*
- `.gitignore` — add `dist/`
- `.npmignore` — update for new structure

**Delete:**
- `Gruntfile.coffee`, `grunt/` directory
- `.coffeelint`
- `yarn.lock` (will use npm)

**Install deps:** `npm install`

## Phase 2: Type Definitions

**Create `src/types.ts`:**
- `SynoConfig` — constructor params (account, passwd, protocol, host, port, apiVersion, debug, ignoreCertificateErrors)
- `RequestOptions` — api, version, path, method, params, sessionName
- `ApiInfos` — api, version, path, method, sessionName
- `RequestAPIArgs` — apiInfos + params
- `SynoResponse<T>` — success, data?, error?
- `SessionMap` — `Record<string, { _sid: string | null }>`
- `MethodEntry` — `string | Record<string, MethodPermissions>`
- `ApiDefinition` — path?, minVersion, maxVersion, methods, etc.
- `DefinitionsMap` — `Record<string, ApiDefinition>`

## Phase 3: Core Library

Rewrite CoffeeScript → TypeScript, replace `request` with native `fetch`, replace lodash with native methods, convert callbacks to async/await.

### `src/lib/utils.ts`
Port from `src/syno/Utils.coffee`. All static methods become exported functions. Replace lodash's `camelCase`, `startsWith`, `endsWith`, `filter`, `each`, `first`, `last` with native equivalents. Preserve the exact `createFunctionName` pipeline and ~80-word `fixCamelCase` list.

### `src/lib/errors.ts`
- `SynoError` class extending `Error` with `code` and `errors` fields
- `resolveBaseError(code)` — codes 101-107
- `resolveAuthError(code)` — codes 400-404
- `resolveFileStationError(code, api)` — ported from FileStation.coffee
- `resolveDownloadStationError(code, api)` — ported from DownloadStation.coffee
- `resolveSurveillanceStationError(code, api)` — ported from SurveillanceStation.coffee, **fixing the `or` bug** by using `api === 'X' || api === 'Y'`

### `src/lib/API.ts`
Port from `src/syno/API.coffee`:
- `request(options)` → async, uses `fetch()` + `URLSearchParams`
- TLS bypass via `undici` Agent (bundled with Node 24) when `ignoreCertificateErrors` is true
- `requestAPI(args)` → async, normalizes params to strings
- `resolveError(code, api)` — overridable, defaults to `resolveBaseError`

### `src/lib/Auth.ts`
Port from `src/syno/Auth.coffee`:
- `login(sessionName)` → async, returns `{ sid: string }`
- `logout(sessionName?)` → async, cleans up sessions
- Override `resolveError` with auth-specific codes

### `src/lib/AuthenticatedAPI.ts`
Port from `src/syno/AuthenticatedAPI.coffee`:
- Override `request()` — check `sessions[sessionName]?._sid`, auto-login if absent
- **Fix SID bug:** store `{ _sid: response.sid }` (object), not raw string

### `src/lib/DefinitionLoader.ts`
Extracted from `Syno.coffee`'s `loadDefinitions`:
- `loadDefinitions(apiVersion)` — reads `definitions/{major}.x/_full.json`, caches in Map
- `validateApiVersion(version)` — throws if not in known list
- `getMethodsForApi(definitions, apiKey)` — handles both string and object method formats

### `src/lib/DynamicStation.ts`
Replaces `createFunctionsFor` + `new Function()` + `__proto__` mutation with Proxy:
- `buildMethodMap(definitions, apiPrefixes, sessionName)` → `Map<string, MethodInfo>` mapping camelCase names to `{ api, version, path, method, sessionName }`
- `createProxiedStation(station, methodMap)` → Proxy that intercepts `get` for dynamic method names, returning bound async functions that call `requestAPI`

## Phase 4: Station Classes

**Create `src/stations/` with 7 files**, all following the same pattern:

```
constructor(syno) → super(syno), set sessionName, buildMethodMap, return createProxiedStation(this, map)
getMethods() → Array.from(methodMap.keys())
call(methodName, params?) → typed escape hatch for dynamic invocation
resolveError(code, api) → override for stations with custom error codes
```

| File | Prefixes | Session |
|---|---|---|
| `DSM.ts` | `['SYNO.DSM', 'SYNO.Core']` | `'DiskStationManager'` |
| `FileStation.ts` | `['SYNO.FileStation']` | `'FileStation'` |
| `DownloadStation.ts` | `['SYNO.DownloadStation']` | `'DownloadStation'` |
| `AudioStation.ts` | `['SYNO.AudioStation']` | `'AudioStation'` |
| `VideoStation.ts` | `['SYNO.VideoStation']` | `'VideoStation'` |
| `VideoStationDTV.ts` | `['SYNO.DTV']` | `'VideoStation'` |
| `SurveillanceStation.ts` | `['SYNO.SurveillanceStation']` | `'SurveillanceStation'` |

FileStation, DownloadStation, and SurveillanceStation override `resolveError` using centralized error maps from `errors.ts`.

## Phase 5: Syno Root + Exports

### `src/lib/Syno.ts`
Port from `src/syno/Syno.coffee`:
- Constructor: validate config, merge with env var defaults, call `validateApiVersion`, instantiate Auth + all 7 stations with short aliases (`dsm`, `fs`, `dl`, `as`, `vs`, `dtv`, `ss`)
- `loadDefinitions()` — delegates to `DefinitionLoader`
- No more `createFunctionsFor` (moved to DynamicStation)

### `src/index.ts`
Public API: export `Syno`, `SynoConfig`, `SynoError`, station types.

## Phase 6: CLI Rewrite

### `src/cli/config.ts`
Replace `nconf` + `ospath` + `url.parse`:
- `parseUrl(rawUrl)` — uses `new URL()`, validates protocol
- `loadConfigFile(path)` — `fs.readFileSync` + `yaml.load` (js-yaml v4)
- `ensureDefaultConfig()` — creates `~/.syno/config.yaml` if missing
- `resolveConfig(opts)` — URL → config file → default, returns merged config

### `src/cli/index.ts`
Replace `src/cli/syno.coffee`:
- Commander v12 with `parseAsync()` (single parse, not two)
- 7 station subcommands with aliases (same as v2)
- `execute()` — async, checks method exists (**fix: exit 1 if not**), JSON.parse payload, call method, logout, exit
- Global options: `-c`, `-u`, `-d`, `-a`, `-i`

## Phase 7: Tests

### `src/__tests__/`
- `utils.test.ts` — test `createFunctionName` pipeline with known inputs from current codebase
- `errors.test.ts` — test all error code resolvers
- `API.test.ts` — mock `globalThis.fetch`, test URL construction, error handling
- `Auth.test.ts` — mock fetch, test login/logout session management
- `AuthenticatedAPI.test.ts` — test auto-login, SID caching, **verify SID bug is fixed**
- `DefinitionLoader.test.ts` — test loading real `_full.json` files, both method formats
- `DynamicStation.test.ts` — test Proxy dispatch, unknown methods return undefined, `getMethods()`
- `Syno.test.ts` — test constructor validation, env var defaults, station instantiation
- `stations/SurveillanceStation.test.ts` — **verify `or` bug is fixed** (error only for matching APIs)
- `cli/config.test.ts` — test `parseUrl`, `resolveConfig`, invalid inputs

## Phase 8: Cleanup

**Delete all legacy files:**
- `src/syno/` (all .coffee files)
- `src/cli/syno.coffee`
- `bin/` directory
- `dist/syno.js`, `dist/syno-5.x.min.js`, `dist/syno-6.x.min.js`
- `test/browser/` directory
- `test/cli/syno.sh`
- `scripts/browserify.sh`, `scripts/download_spk.sh`, `scripts/extract_spk.sh`
- `.travis.yml` (replace with GitHub Actions if desired)

**Keep:** `definitions/`, `scripts/compile_libs.sh`, `README.md`, `CHANGELOG.md`, `LICENSE-MIT`

**Update:** `CLAUDE.md` with new commands and architecture, `README.md` with v3 usage.

## Verification

1. `npm run typecheck` — zero errors
2. `npm run lint` — zero errors
3. `npm run build` — produces `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`, `dist/cli.cjs`
4. `npm run test` — all vitest tests pass
5. `node -e "const { Syno } = require('./dist/index.cjs'); console.log(typeof Syno)"` — prints `function`
6. `node -e "import('./dist/index.js').then(m => console.log(typeof m.Syno))"` — prints `function`
7. `node dist/cli.cjs --help` — prints help text
8. `node dist/cli.cjs --version` — prints `3.0.0`

## Final Source Tree

```
src/
  index.ts
  types.ts
  lib/
    API.ts
    Auth.ts
    AuthenticatedAPI.ts
    DefinitionLoader.ts
    DynamicStation.ts
    Syno.ts
    errors.ts
    utils.ts
  stations/
    DSM.ts
    FileStation.ts
    DownloadStation.ts
    AudioStation.ts
    VideoStation.ts
    VideoStationDTV.ts
    SurveillanceStation.ts
  cli/
    index.ts
    config.ts
  __tests__/
    utils.test.ts
    errors.test.ts
    API.test.ts
    Auth.test.ts
    AuthenticatedAPI.test.ts
    DefinitionLoader.test.ts
    DynamicStation.test.ts
    Syno.test.ts
    stations/
      SurveillanceStation.test.ts
    cli/
      config.test.ts
definitions/          # unchanged
  5.x/_full.json
  6.x/_full.json
```
