## 3.0.0

### Breaking Changes

- **Full TypeScript rewrite** — CoffeeScript removed entirely
- **Node 24+ required** — uses native `fetch`, no polyfills
- **ESM + CJS dual output** — `import { Syno } from 'syno'` or `require('syno')`
- **Async/await only** — callbacks removed, all methods return Promises
- **Browser support dropped** — Node.js only
- **Default API version** changed from `6.0.2` to `7.2`
- **DSM 5.x support dropped** — only 6.x and 7.x definitions are included

### New Features

- **DSM 7.x support** — new `definitions/7.x/_full.json` (#72)
- **Synology Photos station** — `SYNO.Foto.*` / `SYNO.FotoTeam.*` for DSM 7.x (#41)
- **Two-factor authentication (OTP)** — optional `otpCode` param on login (#42)
- **Binary response handling** — returns `ArrayBuffer` for non-JSON responses like images (#40)
- **Per-request API version override** — pass `version` in method params (#29)
- **QuickConnect support** — follows redirects transparently via native `fetch` (#48)
- **Session reuse** — optional `sid` param to skip login (#39)
- **Proxy-based dynamic methods** — replaces `new Function()` + `__proto__` mutation
- **TypeScript types exported** — `SynoConfig`, `SynoError`, station types
- **Automated definition fetcher** — `scripts/fetch-definitions.ts` replaces legacy shell scripts

### Bug Fixes

1. SurveillanceStation error resolver — `if api is 'X' or 'Y'` always truthy (CoffeeScript `or` bug)
2. CLI `execute` — missing `process.exit(1)` on unknown method (process hangs)
3. CLI `program.parse` called twice — restructured to single `parseAsync()`
4. Session SID — stored raw string instead of object, causing re-auth every call

### Dependency Changes

- Runtime: `commander` ^12, `js-yaml` ^4, `pluralize` ^8 (3 deps, down from 9)
- Removed: `request`, `lodash`, `nconf`, `ospath`, `minimist`
- Build: `tsdown`, `vitest`, `eslint` + `@typescript-eslint`

### Packages version compiled for 6.x

| API | Package version |
|:----|:----------------|
| DSM | 24922 |
| File Station | 24922 |
| Download Station | 3.8.12-3518 |
| Audio Station | 6.5.3-3363 |
| Video Station | 2.4.6-1594 |
| Video Station DTV | 2.4.6-1594 |
| Surveillance Station | 8.2.6-6009 |

### Packages version compiled for 7.x

| API | Package version |
|:----|:----------------|
| DSM | Based on 6.x definitions (pending SPK extraction) |
| File Station | Based on 6.x definitions (pending SPK extraction) |
| Download Station | Based on 6.x definitions (pending SPK extraction) |
| Audio Station | Based on 6.x definitions (pending SPK extraction) |
| Video Station | Based on 6.x definitions (pending SPK extraction) |
| Video Station DTV | Based on 6.x definitions (pending SPK extraction) |
| Surveillance Station | Based on 6.x definitions (pending SPK extraction) |
| Synology Photos | Initial definition set |

## 2.2.0

- Update libs
- Update dependencies
- Handling exception when a command is not found

### Packages version compiled for 5.x

| API | Package version |
|:----|:----------------|
| DSM | 5967 |
| File Station | 5967 |
| Download Station | 3.5-2988 |
| Audio Station | 5.4-2860 |
| Video Station | 1.6-0859 |
| Video Station DTV | 1.6-0859 |
| Surveillance Station | 7.1-4155 |

### Packages version compiled for 6.x

| API | Package version |
|:----|:----------------|
| DSM | 24922 |
| File Station | 24922 |
| Download Station | 3.8.12-3518 |
| Audio Station | 6.5.3-3363 |
| Video Station | 2.4.6-1594 |
| Video Station DTV | 2.4.6-1594 |
| Surveillance Station | 8.2.6-6009 |

## 2.1.0

- Update DSM Lib for 6.x. Now using 6.0.2-8451 package version
- Update VideoStation Lib for 6.x. Now using 2.2.0-1361 package version
- Update SurveillanceStation Lib for 6.x. Now using 8.0.0-5070 package version
- Update DownloadStation Lib for 6.x. Now using 3.8.1-3420 package version
- Update AudioStation Lib for 6.x. Now using 6.0.1-3092 package version
- Manage multiple sessions for logins fixing https://github.com/kwent/syno/issues/28 & https://github.com/kwent/syno/issues/15
- Take maxVersion by default instead minVersion
- Fix pluralizing for action name. Fixing https://github.com/kwent/syno/pull/26. Thanks @shir

### Packages version compiled for 5.x

| API | Package version |
|:----|:----------------|
| DSM | 5967 |
| File Station | 5967 |
| Download Station | 3.5-2970 |
| Audio Station | 5.4-2860 |
| Video Station | 1.6-0858 |
| Video Station DTV | 1.6-0858 |
| Surveillance Station | 7.1-4141 |

### Packages version compiled for 6.x

| API | Package version |
|:----|:----------------|
| DSM | 8451 |
| File Station | 8451 |
| Download Station | 3.8.1-3420 |
| Audio Station | 6.0.1-3092 |
| Video Station | 2.2.0-1361 |
| Video Station DTV | 2.2.0-1361 |
| Surveillance Station | 8.0.0-5070 |

## 2.0.1

- Update dependencies
- CLI Fixes using no deprecated fs api

## 2.0.0

- Add support for 5.x and 6.x
- Add DSM API support
- Bug fixes

### Packages version compiled for 5.x

| API | Package version |
|:----|:----------------|
| DSM | 5967 |
| File Station | 5967 |
| Download Station | 3.5-2970 |
| Audio Station | 5.4-2860 |
| Video Station | 1.6-0858 |
| Video Station DTV | 1.6-0858 |
| Surveillance Station | 7.1-4141 |

### Packages version compiled for 6.x

| API | Package version |
|:----|:----------------|
| DSM | 7321 |
| File Station | 7321 |
| Download Station | 3.7.1-3282 |
| Audio Station | 5.5-2985 |
| Video Station | 2.1.0-1226 |
| Video Station DTV | 2.1.0-1226 |
| Surveillance Station | 7.2.1-4602 |

## 1.0.6

- Update dependencies

## 1.0.5

- Fix getMethods VideoStationDTV

## 1.0.4

- Add VideoStation and VideoStation DTV support

## 1.0.3

- Add AudioStation support

## 1.0.2

- Add FileStation and DownloadStation support to CLI

## 1.0.0

- First major release
