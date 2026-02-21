# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**syno** is a Node.js wrapper and CLI for the Synology DSM REST API (supports DSM 5.x, 6.x, and 7.x). Written in TypeScript with ESM + CJS dual output. Ships a CLI executable.

## Build & Development Commands

```bash
# Build (tsdown: ESM + CJS + DTS)
npm run build

# Run tests (vitest)
npm test

# Run tests in watch mode
npm run test:watch

# Lint TypeScript
npm run lint

# Type check
npm run typecheck

# Clean dist/
npm run clean

# Fetch/compile API definitions
npm run fetch-defs          # Full pipeline (download + extract + compile)
npm run compile-defs        # Just merge existing .api/.lib files
```

### Environment Variables (for CLI integration tests)

`SYNO_PROTOCOL`, `SYNO_HOST`, `SYNO_PORT`, `SYNO_ACCOUNT`, `SYNO_PASSWORD`

## Architecture

### Class Hierarchy (all in `src/lib/`)

- **API** (`API.ts`) — base class; makes HTTP requests via native `fetch` to `{protocol}://{host}:{port}/webapi/{path}`
- **Auth** (`Auth.ts`) — extends API; handles login/logout via `SYNO.API.Auth`, supports OTP
- **AuthenticatedAPI** (`AuthenticatedAPI.ts`) — extends API; auto-calls `auth.login()` if no session SID before each request
- **Syno** (`Syno.ts`) — top-level entry point; instantiates Auth + all station APIs

### Station Classes (in `src/stations/`)

Each extends AuthenticatedAPI and uses Proxy-based dynamic method generation:
- **DSM**, **FileStation**, **DownloadStation**, **AudioStation**, **VideoStation**, **VideoStationDTV**, **SurveillanceStation**, **SynologyPhotos**

### Dynamic Method Generation (`src/lib/DynamicStation.ts`)

Uses `buildMethodMap()` to read `definitions/{version}/_full.json` and create a `Map<string, MethodInfo>`. `createProxiedStation()` wraps the station in a `Proxy` that intercepts property access to dispatch dynamic API methods.

### Utilities

- **`src/lib/utils.ts`** — `createFunctionName()` pipeline: trimSyno -> deletePattern -> fixCamelCase -> listPluralize -> camelCase
- **`src/lib/errors.ts`** — Error resolvers for base, auth, FileStation, DownloadStation, SurveillanceStation
- **`src/lib/DefinitionLoader.ts`** — Loads and caches API definitions from JSON files

### CLI (`src/cli/`)

- **`config.ts`** — URL parsing, YAML config loading, env var resolution
- **`index.ts`** — Commander v12 with `parseAsync()`, 8 station subcommands

### Build Pipeline

tsdown (powered by rolldown): TypeScript -> ESM (`dist/index.js`) + CJS (`dist/index.cjs`) + DTS (`dist/index.d.ts`) + CLI (`dist/cli.cjs` with shebang)

### Key Directories

- `src/` — TypeScript source (library + CLI + tests)
- `dist/` — compiled/bundled output (gitignored)
- `definitions/` — Synology API definition JSON files; `_full.json` files per version
- `scripts/` — `fetch-definitions.ts` for downloading/compiling API definitions

## TypeScript Style

- Strict mode enabled
- ESM with `.js` extensions in imports (NodeNext resolution)
- Async/await only — no callbacks
- Native `fetch` — no HTTP client dependencies
