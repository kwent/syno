# Syno

Node.js wrapper and CLI for Synology DSM REST API 6.x and 7.x.

[![npm version](https://img.shields.io/npm/v/syno.svg?style=flat)](https://www.npmjs.com/package/syno)

See [Synology Development Tool](https://www.synology.com/en-us/support/developer#tool).

# Installation

```bash
npm install syno
```

For the CLI:

```bash
npm install -g syno
```

**Requires Node.js >= 24.0.0**

# Syno API

* **DSM API** (SYNO.DSM, SYNO.Core)
* **File Station API** (SYNO.FileStation)
* **Download Station API** (SYNO.DownloadStation)
* **Audio Station API** (SYNO.AudioStation)
* **Video Station API** (SYNO.VideoStation)
* **Video Station DTV API** (SYNO.DTV)
* **Surveillance Station API** (SYNO.SurveillanceStation)
* **Synology Photos API** (SYNO.Foto, SYNO.FotoTeam) - DSM 7.x only

For detailed parameters and response data, refer to the Synology Developer Tool [page](https://www.synology.com/en-us/support/developer#tool).

# JavaScript / TypeScript

```ts
import { Syno } from 'syno';

const syno = new Syno({
    // Requests protocol: 'http' or 'https' (default: 'http')
    protocol: 'https',
    // DSM host: IP or domain name (default: 'localhost')
    host: 'localhost',
    // DSM port (default: 5000)
    port: 5001,
    // DSM User account (required)
    account: 'my_username',
    // DSM User password (required)
    passwd: 'my_password',
    // DSM API version (default: '7.2')
    apiVersion: '7.2',
});
```

All methods return Promises:

```ts
const info = await syno.fs.getInfo();
```

Or call a method dynamically:

```ts
const info = await syno.fs.call('getInfo', { folder_path: '/path' });
```

## Examples

```ts
// DSM API - Provide DSM information
const dsmInfo = await syno.dsm.getInfo();

// File Station API - Provide File Station information
const fsInfo = await syno.fs.getInfo();

// File Station API - Enumerate files in a given folder
const files = await syno.fs.list({ folder_path: '/path/to/folder' });

// Download Station API - List download tasks
const tasks = await syno.dl.listTasks({ limit: 5, offset: 10 });

// Download Station API - Create a download task
await syno.dl.createTask({ uri: 'https://link' });

// Audio Station API - Search a song
const songs = await syno.as.searchSong({ title: 'my_title_song' });

// Video Station API - List movies
const movies = await syno.vs.listMovies({ limit: 5 });

// Video Station DTV API - List channels
const channels = await syno.dtv.listChannels({ limit: 5 });

// Surveillance Station API - Get camera information
const camera = await syno.ss.getInfoCamera({ cameraIds: 4 });

// Synology Photos API (DSM 7.x) - List albums
const albums = await syno.photo.listAlbums();
```

## Configuration Options

| Option | Type | Default | Description |
|---|---|---|---|
| `account` | `string` | - | DSM user account (required) |
| `passwd` | `string` | - | DSM user password (required) |
| `protocol` | `string` | `'http'` | `'http'` or `'https'` |
| `host` | `string` | `'localhost'` | DSM hostname or IP |
| `port` | `number` | `5000` | DSM port |
| `apiVersion` | `string` | `'7.2'` | DSM API version |
| `debug` | `boolean` | `false` | Enable debug logging |
| `ignoreCertificateErrors` | `boolean` | `false` | Ignore TLS certificate errors |
| `otpCode` | `string` | - | Two-factor auth OTP code |
| `sid` | `string` | - | Reuse an existing session ID |
| `followRedirects` | `boolean` | `true` | Follow HTTP redirects (QuickConnect) |

## Station Aliases

| Short | Long | Class |
|---|---|---|
| `syno.dsm` | `syno.diskStationManager` | `DSM` |
| `syno.fs` | `syno.fileStation` | `FileStation` |
| `syno.dl` | `syno.downloadStation` | `DownloadStation` |
| `syno.as` | `syno.audioStation` | `AudioStation` |
| `syno.vs` | `syno.videoStation` | `VideoStation` |
| `syno.dtv` | `syno.videoStationDTV` | `VideoStationDTV` |
| `syno.ss` | `syno.surveillanceStation` | `SurveillanceStation` |
| `syno.photo` | `syno.synologyPhotos` | `SynologyPhotos` |

# CLI

```
$ syno --help
Usage: syno [options] [command]

Synology Rest API Command Line

Options:
  -V, --version                              output the version number
  -c, --config <path>                        DSM Configuration file. Default to ~/.syno/config.yaml
  -u, --url <url>                            DSM URL. Default to https://admin:password@localhost:5001
  -d, --debug                                Enabling Debugging Output
  -a, --api <version>                        DSM API Version. Default to 7.2
  -i, --ignore-certificate-errors            Ignore certificate errors
  -h, --help                                 display help for command

Commands:
  diskstationmanager|dsm [options] <method>  DSM API
  filestation|fs [options] <method>          DSM File Station API
  downloadstation|dl [options] <method>      DSM Download Station API
  audiostation|as [options] <method>         DSM Audio Station API
  videostation|vs [options] <method>         DSM Video Station API
  videostationdtv|dtv [options] <method>     DSM Video Station DTV API
  surveillancestation|ss [options] <method>  DSM Surveillance Station API
  synologyphotos|photo [options] <method>    DSM Synology Photos API
```

## CLI Examples

```bash
# DSM API - Provide DSM information
$ syno dsm getInfo --pretty

# File Station API - Enumerate files in a given folder
$ syno fs listFiles --payload '{"folder_path":"/path/to/folder"}' --pretty

# Download Station API - Create a download task
$ syno dl createTask --payload '{"uri":"https://link"}'

# Audio Station API - Search a song
$ syno as searchSong --payload '{"title":"my_title_song"}' --pretty

# Video Station API - List movies
$ syno vs listMovies --payload '{"limit":5}' --pretty

# Video Station DTV API - List channels
$ syno dtv listChannels --payload '{"limit":5}' --pretty

# Surveillance Station API - Get camera information
$ syno ss getInfoCamera --payload '{"cameraIds":4}' --pretty
```

## CLI Authentication

### Via environment variables

```bash
export SYNO_ACCOUNT=user
export SYNO_PASSWORD=password
export SYNO_PROTOCOL=https
export SYNO_HOST=localhost
export SYNO_PORT=5001
```

### Via URL

```bash
$ syno fs getInfo --url https://user:password@localhost:5001 --pretty
```

### Via configuration file

```yaml
# ~/.syno/config.yaml
url:
  protocol: https
  host: localhost
  port: 5001
  account: admin
  passwd: password
```

```bash
$ syno fs getInfo --pretty
```

More usage [examples](https://github.com/kwent/syno/wiki/CLI) in the [wiki](https://github.com/kwent/syno/wiki).

# Migrating from 2.x to 3.x

## Breaking changes

- **Async/await only** — All methods now return Promises. Callbacks are no longer supported.
  ```ts
  // Before (2.x)
  syno.fs.getInfo(function(err, data) { ... });
  // After (3.x)
  const data = await syno.fs.getInfo();
  ```
- **Node.js 24+ required** — Uses native `fetch`, no polyfills needed.
- **Browser support removed** — Node.js only. Browser bundles are no longer shipped.
- **Default API version** changed from `6.0.2` to `7.2`.
- **DSM 5.x support dropped** — Only 6.x and 7.x definitions are included.
- **ESM + CJS dual output** — `import { Syno } from 'syno'` or `const { Syno } = require('syno')`.
- **TypeScript types included** — No separate `@types` package needed.

# Tips & Tricks

If you encounter certificate errors with `https`:

```bash
[ERROR] : Error: UNABLE_TO_VERIFY_LEAF_SIGNATURE
```

Use the `--ignore-certificate-errors` flag:

```bash
$ syno fs getInfo --ignore-certificate-errors
```

Or set the environment variable:

```bash
export SYNO_IGNORE_CERTIFICATE_ERRORS=1
```

Or in code:

```ts
const syno = new Syno({
    ignoreCertificateErrors: true,
    // ...
});
```

# History

View the [changelog](https://github.com/kwent/syno/blob/master/CHANGELOG.md)

# Authors

- [Quentin Rousseau](https://github.com/kwent)

# License

MIT - See [LICENSE-MIT](LICENSE-MIT)
