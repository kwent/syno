syno
====

Simple wrapper for Synology DSM REST API

# API

## Syno

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

## Authentication

The `syno` object uses the `auth` property to interact with the Authentication API.

### Login

    syno.auth.login(function(error){
        // Do whatever you want here
    });

### Logout

    syno.auth.logout(function(error){
        // Do whatever you want here
    });

## File Station

The FileStation API is an `AuthenticatedAPI`, that means the user needs to be authenticated before using this API.
Fortunately, the `AuthenticatedAPI` is smart enough to automatically log the user.

The `syno` object uses the `fs` (or `fileStation` alias) property to interact with the FileStation API.

### File Station Info

Provide File Station information.

```javascript
// No parameter.
syno.fs.getFileStationInfo(function(error, data){
    // Data response :
    // is_manager       -> If the logged-in user is an administrator.
    // support_virtual  -> Types of virtual file system which the logged user is able to mount on.
    //                     Different types are separated with a comma, for example: cifs,iso.
    // support_sharing  -> If the logged-in user can sharing file(s)/folder(s) or not.
    // hostname         -> DSM host name.
});
```

### Shared Folders

List all shared folders, enumerate files in a shared folder, and get detailed file information.

    // Request
    // offset           -> Optional. Specify how many shared folders are skipped before beginning to return listed
    //                     shared folders. Default: 0
    // limit            -> Optional. Number of shared folders requested. 0 lists all shared folders. Default: 0
    // sort_by          -> Optional. Specify which file information to sort on. Default: name
    //                     Possible values : [name, user, group, mtime, atime, ctime, crtime, posix]
    // sort_direction   -> Optional. Specify to sort ascending or to sort descending. Default: asc
    //                     Possible values: [asc, desc]
    // onlywritable     -> Optional. 'true': List writable shared folders; 'false': List writable and read-only shared
    //                     folders. Default: false
    // additional       -> Optional. Additional requested file information, separated by commas ','. When an additional
    //                     option is requested, responded objects will be provided in the specified additional option.
    //                     Possible values: [real_path, owner, time, perm, mount_point_type, sync_share, volume_status]
    syno.fs.listSharedFolders(function(error, data){
        // Response
        // is_manager       -> If the logged-in user is an administrator.
        // support_virtual  -> Types of virtual file system which the logged user is able to mount on.
        //                     Different types are separated with a comma, for example: cifs,iso.
        // support_sharing  -> If the logged-in user can sharing file(s)/folder(s) or not.
        // hostname         -> DSM host name.
    });

## Download Station

# License

[MIT](LICENSE-MIT)