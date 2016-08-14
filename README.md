# Syno

Simple Node.js wrapper (browser included) and CLI for Synology DSM REST API 5.x and 6.x.

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Build Status](https://travis-ci.org/kwent/syno.svg?branch=master)](https://travis-ci.org/kwent/syno)
[![npm version](https://img.shields.io/npm/v/syno.svg?style=flat)](https://www.npmjs.com/package/syno)
[![Dependency Status](https://david-dm.org/kwent/syno.svg?theme=shields.io)](https://www.npmjs.com/package/syno)
[![devDependency Status](https://david-dm.org/kwent/syno/dev-status.svg?theme=shields.io)](https://www.npmjs.com/package/syno)
![Synology Development Tool](https://www.synology.com/img/support/developer/banner.png)

See [Synology Development Tool](https://www.synology.com/en-us/support/developer#tool).

# Installation

Just install the module using npm.

```bash
$ npm install syno
```

If you want to save it as a dependency, just add the `--save` option.

```bash
$ npm install syno --save
```

If you want to install with the **CLI** executable, just add the `--global` option.

```bash
$ npm install syno --global
```

# Syno API

This is a simple presentation of the syno API and its methods.
To get more information (parameters, response data, ...) refer to the Synology Developer Tool [page](https://www.synology.com/en-us/support/developer#tool).

* **DSM API**
* **File Station API**
* **Download Station API**
* **Audio Station API**
* **Video Station API**
* **Video Station DTV API**
* **Surveillance Station API**

# Javascript wrapper

```js
var Syno = require('syno');
var syno = new Syno({
    // Requests protocol : 'http' or 'https' (default: http)
    protocol: 'https',
    // DSM host : ip, domain name (default: localhost)
    host: 'localhost',
    // DSM port : port number (default: 5000)
    port: '5001',
    // DSM User account (required)
    account: 'my_username',
    // DSM User password (required)
    passwd: 'my_password'
    // DSM API version (optional, default: 6.0)
    apiVersion: '6.0'
});
```

This is how to use an API on the `syno` object

```js
syno.api.method(params, callback);
```

All arguments are optional by default :
- `params` : object hash with request parameters
- `callback` : function called with 2 arguments (`error`, `data`)

The `data` arguments passed to the callback is an object hash, holding the response data. (see API documents)

Both the `params` and `callback` are optional, so you can call any method these ways :

```js
// Both params and callback
syno.api.method(params, callback);
// Only params parameter
syno.api.method(params);
// Only callback parameter
syno.api.method(callback);
// No parameter
syno.api.method();
```

**N.B** : If the `params` parameter is not passed, but the method expects **required parameters**, an `Error` will be
thrown.

## Examples

```js
// DSM API - Provide DSM information
syno.dsm.getInfo(callback);
// File Station API - Provide File Station information
syno.fs.getInfo(callback);
// File Station API - Enumerate files in a given folder
syno.fs.list({'folder_path':'/path/to/folder'}, callback);
// Download Station API - List download tasks
syno.dl.listFiles({'limit':5, 'offset':10}, callback);
// Download Station API - Create a download task
syno.dl.createTask({'uri':'https://link'}, callback);
// Audio Station API - Search a song
syno.as.searchSong({'title':'my_title_song'}, callback);
// Video Station API - List movies
syno.vs.listMovies({'limit':5}, callback);
// Video Station DTV API - List channels
syno.dtv.listChannels({'limit':5}, callback);
// Surveillance Station API - Get camera information
syno.ss.getInfoCamera({'cameraIds':4}, callback);
```
# CLI

```
$ syno --help
Usage: syno [options]

  Synology Rest API Command Line

  Options:

    -h, --help                       output usage information
    -V, --version                    output the version number
    -c, --config <path>              DSM Configuration file. Default to ~/.syno/config.yaml
    -u, --url <url>                  DSM URL. Default to https://admin:password@localhost:5001
    -d, --debug                      Enabling Debugging Output
    -a, --api <version>              DSM API Version. Default to 6.0
    -i, --ignore-certificate-errors  Ignore certificate errors

  Commands:

    diskstationmanager|dsm [options] <method> DSM API
    filestation|fs [options] <method> DSM File Station API
    downloadstation|dl [options] <method> DSM Download Station API
    audiostation|as [options] <method> DSM Audio Station API
    videostation|vs [options] <method> DSM Video Station API
    videostationdtv|dtv [options] <method> DSM Video Station DTV API
    surveillancestation|ss [options] <method> DSM Surveillance Station API

  Examples:

    $ syno diskstationmanager|dsm getInfo
    $ syno filestation|fs getInfo
    $ syno downloadstation|dl getInfo
    $ syno audiostation|as getInfo
    $ syno videostation|vs getInfo
    $ syno videostationdtv|dtv listChannels --payload '{"limit":5}' --pretty
    $ syno surveillancestation|ss getInfo
```
## Examples

```bash
# DSM API - Provide DSM information
$ syno dsm getInfo --pretty
# File Station API - Provide File Station information
$ syno fs getInfo --pretty
# File Station API - Enumerate files in a given folder
$ syno fs listFiles --payload '{"folder_path":"/path/to/folder"}' --pretty
# Download Station API - List download tasks
$ syno dl listFiles --payload '{"limit":5, "offset":10}' --pretty
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

### Without a configuration file

```bash
$ syno fs getInfo --url https://user:password@localhost:5001 --pretty
```

### With a configuration file

```yaml

# Example config file, by default it should be located at:
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

# Browser

### Note

Be sure to disable [same-origin policy](http://en.wikipedia.org/wiki/Same-origin_policy) in your browser.

## Example

```html
<html>
  <head>
  <script src="syno-6.x.min.js"></script>
  <script type="text/javascript">
  var Syno = require('syno.Syno');
  var syno = new Syno({
      // Requests protocol : 'http' or 'https' (default: http)
      protocol: 'https',
      // DSM host : ip, domain name (default: localhost)
      host: 'localhost',
      // DSM port : port number (default: 5000)
      port: '5001',
      // DSM User account (required)
      account: 'my_username',
      // DSM User password (required)
      passwd: 'my_password'
  });

  syno.fs.getInfo(function(error, data) {
    console.log(data)  
  });
  </script>
  </head>
<html>
```

## Demo

A demo is available [online](http://kwent.github.io/syno/) or in the `test/browser` folder.

# Migrating from 1.0.x to 2.x

## Breaking changes

- Some method names might have change. For example (`getFileStationInfo` to `getInfo`)
- Optional and required parameters are not checked before sending the request anymore.

# Tips & Tricks

If you meet this error when using an `https` connection:

```bash
[ERROR] : Error: UNABLE_TO_VERIFY_LEAF_SIGNATURE
```

You will need to tell `request` to ignore certificate errors:

CLI:

```bash
syno as getInfo --ignore-certificate-errors
```

or

```bash
export SYNO_IGNORE_CERTIFICATE_ERRORS=0
```

Code:

```js
var syno = new Syno({
    ignoreCertificateErrors: false
    // Other options
    // ...
});
```

# History

View the [changelog](https://github.com/kwent/syno/blob/master/CHANGELOG.md)

# Authors

- [Quentin Rousseau](https://github.com/kwent)

# License

```plain
Copyright (c) 2016 Quentin Rousseau <contact@quent.in>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
```
