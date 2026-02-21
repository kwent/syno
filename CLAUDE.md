# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**syno** is a Node.js wrapper and CLI for the Synology DSM REST API (supports DSM 5.x and 6.x). All source code is written in CoffeeScript and compiled to JavaScript for distribution. It also ships browser-compatible bundles.

## Build & Development Commands

```bash
# Full build (lint → compile → bundle → browserify → minify)
grunt

# Run tests (full build + CLI integration tests)
npm test        # or: grunt test

# Lint CoffeeScript only
grunt coffeelint

# Run CLI tests in isolation (requires env vars, see below)
sh test/cli/syno.sh
```

Build requires `grunt-cli` installed globally (`npm install -g grunt-cli`) and `jq` for compiling API definitions.

### Test Environment Variables

CLI integration tests use: `SYNO_TESTS_PROTOCOL`, `SYNO_TESTS_HOST`, `SYNO_TESTS_PORT`, `SYNO_TESTS_ACCOUNT`, `SYNO_TESTS_PASSWD`.

## Architecture

### Class Hierarchy (all in `src/syno/`)

- **API** (`API.coffee`) — base class; makes HTTP requests to `{protocol}://{host}:{port}/webapi/{path}`
- **Auth** (`Auth.coffee`) — extends API; handles login/logout via `SYNO.API.Auth`
- **AuthenticatedAPI** (`AuthenticatedAPI.coffee`) — extends API; auto-calls `auth.login()` if no session SID before each request
  - **DSM**, **FileStation**, **DownloadStation**, **AudioStation**, **VideoStation**, **VideoStationDTV**, **SurveillanceStation** — each extends AuthenticatedAPI
- **Syno** (`Syno.coffee`) — top-level entry point; instantiates Auth + all station APIs
- **Utils** (`Utils.coffee`) — static helpers for generating camelCase method names from API definitions

### Dynamic Method Generation

Each API class calls `syno.createFunctionsFor(this, ['SYNO.XxxStation'])` at construction. This reads compiled `definitions/{version}/_full.json`, matches API keys, and dynamically creates methods using `new Function(...)`. Method names come from `Utils.createFunctionName()` (camelCase + deduplication + pluralization).

### CLI (`src/cli/syno.coffee`)

Built with `commander`. Auth resolution order: `--url` flag → `--config <path>` → `~/.syno/config.yaml` → environment variables (`SYNO_ACCOUNT`, `SYNO_PASSWORD`, `SYNO_PROTOCOL`, `SYNO_HOST`, `SYNO_PORT`).

### Build Pipeline

Grunt tasks configured via YAML in `grunt/`. Pipeline: coffeelint → clean → compile CoffeeScript → concat CLI with shebang → bundle library via mokuai-coffee to `dist/syno.js` → compile definition JSON files via `jq` → browserify → uglify → copy to test folder.

### Key Directories

- `src/` — CoffeeScript source (library + CLI)
- `dist/` — compiled/bundled output (`syno.js`, browser bundles)
- `bin/` — generated CLI executable
- `definitions/` — Synology API definition JSON files; `_full.json` files are compiled from `.lib`/`.api` files via `scripts/compile_libs.sh`
- `scripts/` — shell utilities for compiling definitions, browserifying, downloading/extracting Synology packages

## CoffeeScript Style

Enforced by CoffeeLint (`.coffeelint`): 4-space indentation, 120-char max line length, no double quotes (use single quotes), English operators (`and`/`or`/`not` instead of `&&`/`||`/`!`), no fat arrows unless needed.
