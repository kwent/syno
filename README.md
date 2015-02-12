# Syno

Simple Node.js wrapper and CLI for Synology DSM REST API.

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![npm version](https://img.shields.io/npm/v/syno.svg?style=flat)](https://www.npmjs.com/package/syno)
[![Dependency Status](https://david-dm.org/JimRobs/syno.svg?theme=shields.io)](https://www.npmjs.com/package/syno)
[![devDependency Status](https://david-dm.org/JimRobs/syno/dev-status.svg?theme=shields.io)](https://www.npmjs.com/package/syno)

![Synology Development Tool](https://www.synology.com/img/support/developer/banner.png)

See [Synology Development Tool](https://www.synology.com/en-us/support/developer#tool).

# Installation

Just install the module using npm.

```
npm install syno
```

If you want to save it as a dependency, just add the `--save` option.

```
npm install syno --save
```

If you want to install with the CLI executable, just add the `--global` option.

```
npm install syno --global
```

# Usage

## Syno CLI executable


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

```
$ syno fs --help
Usage: filestation|fs [options] <method>

  DSM File Station API

  Options:

    -h, --help               output usage information
    -c, --config <path>      DSM configuration file. Default to ~/.syno/auth.yaml
    -u, --url <url>          DSM URL. Default to https://admin:password@localhost:5001
    -p, --payload <payload>  JSON Payload
    -P, --pretty             Prettyprint JSON Output
    -d, --debug              Enabling Debugging Output

  Examples:

    $ syno filestation|fs listSharedFolders
    $ syno filestation|fs listFiles --pretty --payload '{"folder_path":"/path/to/folder"}'
```

```
$ syno dl --help
Usage: downloadstation|dl [options] <method>

  DSM Download Station API

  Options:

    -h, --help               output usage information
    -c, --config <path>      DSM configuration file. Default to ~/.syno/auth.yaml
    -u, --url <url>          DSM URL. Default to https://admin:password@localhost:5001
    -p, --payload <payload>  JSON Payload
    -P, --pretty             Prettyprint JSON Output
    -d, --debug              Enabling Debugging Output

  Examples:

    $ syno downloadstation|dl createTask --payload '{"uri":"magnet|ed2k|ftp(s)|http(s)://link"}'
    $ syno downloadstation|dl listTasks
    $ syno downloadstation|dl listTasks --payload '{"limit":1}'
    $ syno downloadstation|dl getTasksInfo --pretty --payload '{"id":"task_id"}'
```

## Examples

### Without a configuration file

```bash
$ syno fs getFileStationInfo -u https://admin:synology@demo.synology.com:5001 -P
```

### With a configuration file

```yaml

# Example config file, by default it should be located at:
# ~/.syno/config.conf

url:
  protocol: http
  host: localhost
  port: 5001
  account: admin
  passwd: password
```

```bash
$ syno fs getFileStationInfo
```

## Syno JS library

```js
var Syno = require('syno');
var syno = new Syno({
    // Requests protocol : 'http' or 'https' (default: http)
    protocol: "http",
    // DSM host : ip, domain name (default: localhost)
    host: "localhost",
    // DSM port : port number (default: 5000)
    port: "5000",
    // DSM User account (required)
    account: 'user_account',
    // DSM User password (required)
    passwd: 'user_password'
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

# API

This is a simple presentation of the syno API and its methods.
To get more information (parameters, response data, ...) use the PDF documents (see below).

* [Authentication](#authentication)
* [File Station](#file-station)
* [Download Station](#download-station)

## Authentication

The `syno` object uses the `auth` property to interact with the Authentication API.

### Login

```js
syno.auth.login(callback);
```

### Logout

```js
syno.auth.logout(callback);
```

## File Station

The FileStation API is an `AuthenticatedAPI`, that means the user needs to be authenticated before using this API.
Fortunately, the `AuthenticatedAPI` is smart enough to automatically log the user.

The `syno` object uses the `fs` (or `fileStation` alias) property to interact with the FileStation API.

[FileStation API](api/FileStation.pdf?raw=true)

### File Station Info

Provide File Station information.

```js
syno.fs.getFileStationInfo(callback);
```

### Shared Folders

List all shared folders, enumerate files in a shared folder, and get detailed file information.
```js
syno.fs.listSharedFolders(params, callback);
```

### Files

Enumerate files in a given folder

**Required params** : folder_path

```js
syno.fs.listFiles(params, callback);
```

Get information of file(s)

**Required params** : path

```js
syno.fs.getFilesInfo(params, callback);
```

### Search (non-blocking API)

Start to search files according to given criteria. If more than one criterion is given in different parameters,
searched files match all these criteria.

**Required params** : folder_path

```js
syno.fs.startSearch(params, callback);
```

Stop the searching task(s). The search temporary database won’t be deleted, so it’s possible to list the search result
using list method after stopping it.

**Required params** : taskid

```js
syno.fs.stopSearch(params, callback);
```

List matched files in a search temporary database. You can check the finished value in response to know if the search
operation is processing or has been finished.

**Required params** : taskid

```js
syno.fs.listSearch(params, callback);
```

Delete search temporary database(s).

**Required params** : taskid

```js
syno.fs.cleanSearches(params, callback);
```

### Virtual Folders

List all mount point folders on one given type of virtual file system.

**Required params** : type

```js
syno.fs.listVirtualFolders(params, callback);
```

### Favorites

List user’s favorites.

```js
syno.fs.listFavorites(params, callback);
```

Add a folder to user’s favorites.

**Required params** : path, name

```js
syno.fs.addFavorite(params, callback);
```

Delete a favorite in user’s favorites.

**Required params** : path

```js
syno.fs.addFavorite(params, callback);
```

Delete all broken statuses of favorites.

```js
syno.fs.cleanBrokenFavorites(params, callback);
```

Edit a favorite name.

**Required params** : path, name

```js
syno.fs.editFavorite(params, callback);
```

Replace multiple favorites of folders to the existed user’s favorites.

**Required params** : path, name

```js
syno.fs.replaceAllFavorites(params, callback);
```

### Thumb

Get a thumbnail of a file.

**Required params** : path

```js
syno.fs.getThumbnail(params, callback);
```

### Directory size (non-blocking API)

Start to calculate size for one or more file/folder paths.

**Required params** : path

```js
syno.fs.startDirSize(params, callback);
```

Get the status of the size calculating task.

**Required params** : taskid

```js
syno.fs.statusDirSize(params, callback);
```

Stop to calculate size.

**Required params** : taskid

```js
syno.fs.stopDirSize(params, callback);
```

### MD5

Start to get MD5 of a file.

**Required params** : file_path

```js
syno.fs.startMD5(params, callback);
```

Get the status of the calculating MD5 task.

**Required params** : taskid

```js
syno.fs.statusMD5(params, callback);
```

Stop calculating the MD5 of a file.

**Required params** : taskid

```js
syno.fs.stopMD5(params, callback);
```

### Check Permission

Check if a logged-in user has write permission to create new files/folders in a given folder.

**Required params** : path

```js
syno.fs.checkWritePermission(params, callback);
```

### Sharing

Get information of a sharing link by the sharing link ID.

**Required params** : id

```js
syno.fs.getSharingLinkInfo(params, callback);
```

List user’s file sharing links.

```js
syno.fs.listSharingLinks(params, callback);
```

Generate one or more sharing link(s) by file/folder path(s).

**Required params** : path

```js
syno.fs.createSharingLinks(params, callback);
```

Delete one or more sharing links.

**Required params** : id

```js
syno.fs.deleteSharingLinks(params, callback);
```

Remove all expired and broken sharing links.

```js
syno.fs.clearInvalidSharingLinks(params, callback);
```

Edit sharing link(s).

**Required params** : id

```js
syno.fs.editSharingLinks(params, callback);
```

### Create Folder

Create folders.

**Required params** : path, name

```js
syno.fs.createFolder(params, callback);
```

### Rename

Rename a file/folder.

**Required params** : path, name

```js
syno.fs.rename(params, callback);
```

### Copy Move (non-blocking API)

Start to copy/move files.

**Required params** : path, dest_folder_path

```js
syno.fs.startCopyMove(params, callback);
```

Get the copying/moving status.

**Required params** : taskid

```js
syno.fs.statusCopyMove(params, callback);
```

Stop a copy/move task.

**Required params** : taskid

```js
syno.fs.stopCopyMove(params, callback);
```

### Delete (non-blocking API)

Delete file(s)/folder(s).

**Required params** : path

```js
syno.fs.startDelete(params, callback);
```

Get the deleting status.

**Required params** : taskid

```js
syno.fs.statusDelete(params, callback);
```

Stop a delete task.

**Required params** : taskid

```js
syno.fs.stopDelete(params, callback);
```

### Delete (blocking API)

Delete files/folders. This is a blocking method. The response is not returned until the deletion operation is completed.

**Required params** : path

```js
syno.fs.delete(params, callback);
```

### Extract (non-blocking API)

Start to extract an archive.

**Required params** : file_path, dest_folder_path

```js
syno.fs.startExtract(params, callback);
```

Get the extract task status.

**Required params** : taskid

```js
syno.fs.statusExtract(params, callback);
```

Stop the extract task.

**Required params** : taskid

```js
syno.fs.stopExtract(params, callback);
```

### Archive file

List archived files contained in an archive.

**Required params** : file_path

```js
syno.fs.listArchiveFiles(params, callback);
```

### Compress (non-blocking API)

Start to compress file(s)/folder(s).

**Required params** : path, dest_file_path

```js
syno.fs.startCompress(params, callback);
```

Get the compress task status.

**Required params** : taskid

```js
syno.fs.statusCompress(params, callback);
```

Stop the compress task.

**Required params** : taskid

```js
syno.fs.stopCompress(params, callback);
```

### Background Tasks

List all background tasks including copy, move, delete, compress and extract tasks.

```js
syno.fs.listBackgroundTasks(params, callback);
```

Delete all finished background tasks.

```js
syno.fs.clearFinishedBackgroundTasks(params, callback);
```

### Download file/folders from File Station

Download files/folders. If only one file is specified, the file content is responded. If more than one file/folder is
given, binary content in ZIP format which they are compressed to is responded.

**Required params** : path, stream

```js
syno.fs.download(params, callback);
```

**N.B. :** `stream` param must be a Writable Stream

### Upload to File Station (experimental)

Upload a file to FileStation. It seems like a fex bytes are not sent, dunno why. Still working on it.

**Required params** : dest_folder_path, filename

```js
syno.fs.upload(params, callback);
```

## Download Station

The DownloadStation API is an `AuthenticatedAPI`, that means the user needs to be authenticated before using this API.
Fortunately, the `AuthenticatedAPI` is smart enough to automatically log the user.

The `syno` object uses the `dl` (or `downloadStation` alias) property to interact with the DownloadStation API.

[DownloadStation API](api/DownloadStation.pdf?raw=true)

### Download Station Info

Get DownloadStation information.

```js
syno.dl.getDownloadStationInfo(callback);
```

Get DownloadStation configuration.

```js
syno.dl.getDownloadStationConfig(callback);
```

Set DownloadStation configuration.

```js
syno.dl.setDownloadStationConfig(params, callback);
```

### Schedule

Get Schedule configuration.

```js
syno.dl.getScheduleConfig(callback);
```

Set Schedule configuration.

```js
syno.dl.setScheduleConfig(params, callback);
```

### Tasks

List download tasks.

```js
syno.dl.listTasks(params, callback);
```

Get download task information.

**Required params** : id

```js
syno.dl.getTasksInfo(params, callback);
```

Create a download task.

```js
syno.dl.createTask(params, callback);
```

Delete one or more download tasks.

**Required params** : id

```js
syno.dl.deleteTasks(params, callback);
```

Pause one or more tasks.

**Required params** : id

```js
syno.dl.pauseTasks(params, callback);
```

Resume one or more tasks.

**Required params** : id

```js
syno.dl.resumeTasks(params, callback);
```

Edit one or more tasks.

**Required params** : id

```js
syno.dl.editTasks(params, callback);
```

### Statistic

Get stats.

```js
syno.dl.getStats(callback);
```

### RSS

List RSS sites.

```js
syno.dl.listRSSSites(params, callback);
```

Refresh RSS sites.

**Required params** : id


```js
syno.dl.refreshRSSSites(params, callback);
```

List RSS feeds.

```js
syno.dl.listRSSFeeds(params, callback);
```

### BTSearch

Start a BTSearch.

**Required params** : keyword, module

```js
syno.dl.startBTSearch(params, callback);
```

List BTSearch.

**Required params** : taskid

```js
syno.dl.listBTSearch(params, callback);
```

Get BTSearch categories.

```js
syno.dl.getBTSearchCategories(callback);
```

Clean BTSearch.

**Required params** : taskid

```js
syno.dl.cleanBTSearch(params, callback);
```

Get BTSearch modules.

```js
syno.dl.getBTSearchModules(callback);
```

# License

[MIT](LICENSE-MIT)
