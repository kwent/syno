# Syno

Simple Node.js wrapper and CLI for Synology DSM REST API.

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Build Status](https://travis-ci.org/JimRobs/syno.svg?branch=master)](https://travis-ci.org/JimRobs/syno)
[![npm version](https://img.shields.io/npm/v/syno.svg?style=flat)](https://www.npmjs.com/package/syno)
[![Dependency Status](https://david-dm.org/JimRobs/syno.svg?theme=shields.io)](https://www.npmjs.com/package/syno)
[![devDependency Status](https://david-dm.org/JimRobs/syno/dev-status.svg?theme=shields.io)](https://www.npmjs.com/package/syno)
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
To get more information (parameters, response data, ...) use the PDF documents (see in the [wiki](https://github.com/JimRobs/syno/wiki)).

* [Authentication Syno API](https://github.com/JimRobs/syno/wiki/Authentication-API)
* [File Station Syno API](https://github.com/JimRobs/syno/wiki/File-Station-API)
* [Download Station Syno API](https://github.com/JimRobs/syno/wiki/Download-Station-API)

# Javascript wrapper

```js
var Syno = require('syno');
var syno = new Syno({
    // Requests protocol : 'http' or 'https' (default: http)
    protocol: 'https',
    // DSM host : ip, domain name (default: localhost)
    host: 'demo.synology.com',
    // DSM port : port number (default: 5000)
    port: '5001',
    // DSM User account (required)
    account: 'admin',
    // DSM User password (required)
    passwd: 'synology'
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
// File Station API - Provide File Station information
syno.fs.getFileStationInfo(callback);
// File Station API - Enumerate files in a given folder
syno.fs.listFiles({'folder_path':'/path/to/folder'}, callback);
// Download Station API - List download tasks
syno.dl.listFiles({'limit':5, 'offset':10}, callback);
// Download Station API - Create a download task
syno.dl.createTask({"uri":"https://link"}, callback);
```
# CLI

```
$ syno --help
Usage: syno [options]

  Synology Rest API Command Line

  Options:

    -h, --help           output usage information
    -V, --version        output the version number

  Commands:

    filestation|fs [options] <method>  DSM File Station API
    downloadstation|dl [options] <method>  DSM Download Station API

  Examples:

    $ syno filestation|fs getFileStationInfo
    $ syno downloadstation|dl getDownloadStationInfo
```
## Examples

```bash
# File Station API - Provide File Station information
$ syno fs getFileStationInfo --pretty
# File Station API - Enumerate files in a given folder
$ syno fs listFiles --payload '{"folder_path":"/path/to/folder"}' --pretty
# Download Station API - List download tasks
$ syno dl listFiles --payload '{"limit":5, "offset":10}' --pretty
# Download Station API - Create a download task
$ syno dl createTask --payload '{"uri":"https://link"}'
```


## CLI Authentication

### Without a configuration file

```bash
$ syno fs getFileStationInfo --url https://admin:synology@demo.synology.com:5001 --pretty
```

### With a configuration file

```yaml

# Example config file, by default it should be located at:
# ~/.syno/config.conf

url:
  protocol: https
  host: localhost
  port: 5001
  account: admin
  passwd: password
```

```bash
$ syno fs getFileStationInfo --pretty
```

More usage [examples](https://github.com/JimRobs/syno/wiki/CLI) in the [wiki](https://github.com/JimRobs/syno/wiki).

# Browser

## Note

Be sure to disable [same-origin policy](http://en.wikipedia.org/wiki/Same-origin_policy) in your browser.

## Example

```html
<html>
  <head>
  <script src="syno.min.js"></script>
  <script type="text/javascript">
  var Syno = require('syno.Syno');
  var syno = new Syno({
      // Requests protocol : 'http' or 'https' (default: http)
      protocol: 'https',
      // DSM host : ip, domain name (default: localhost)
      host: 'demo.synology.com',
      // DSM port : port number (default: 5000)
      port: '5001',
      // DSM User account (required)
      account: 'admin',
      // DSM User password (required)
      passwd: 'synology'
  });

  syno.fs.getFileStationInfo(function(error, data) {
    console.log(data)  
  });
  </script>
  </head>
<html>
```

## Demo

A demo is available [online](https://github.com/JimRobs/syno) or in the `test/browser` folder.

# License

```plain
The MIT License (MIT)

Copyright (c) 2015 Jimmy Robert

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
