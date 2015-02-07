syno
====

Simple wrapper for Synology DSM REST API

# API

This is a simple presentation of the API and its methods.

To get more information (parameters, response data, ...) use the PDF documents (see below).

## Syno

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

The `data` arguments passed to the callback is an object hash, holding the response data (describied in the 'data' part
in the API documents).

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

**N.B** : If the `params` parameter is not passed, but the method expect **required parameters**, an `Error`will be
thrown.

## Authentication

The `syno` object uses the `auth` property to interact with the Authentication API.

### Login

```js
syno.auth.login(function(error){
    // Do whatever you want here
});
```

### Logout

```js
syno.auth.logout(function(error){
    // Do whatever you want here
});
```

## File Station

The FileStation API is an `AuthenticatedAPI`, that means the user needs to be authenticated before using this API.
Fortunately, the `AuthenticatedAPI` is smart enough to automatically log the user.

The `syno` object uses the `fs` (or `fileStation` alias) property to interact with the FileStation API.

[FileStation API](api/FileStation.pdf)

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

## Download Station

[DownloadStation API](api/DownloadStation.pdf)

# License

[MIT](LICENSE-MIT)