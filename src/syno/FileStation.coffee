# Require lodash functions
{defaults} = require 'lodash'

class FileStation extends AuthenticatedAPI

    # Handle FileStation API errors
    error: (code, api)->
        # Favorite API specific errors
        if api is 'SYNO.FileStation.Favorite'
            switch code
                when 800 then return 'A folder path of favorite folder is already added to user\'s favorites.'
                when 801
                    return 'A name of favorite folder conflicts with an existing folder path in the user\'s favorites.'
                when 802 then return 'There are too many favorites to be added.'
        # Upload API specific errors
        if api is 'SYNO.FileStation.Upload'
            switch code
                when 1800
                    return 'There is no Content-Length information in the HTTP header or the received size doesn\'t
                        match the value of Content-Length information in the HTTP header.'
                when 1801
                    return 'Wait too long, no date can be received from client (Default maximum wait time is 3600
                        seconds).'
                when 1802 then return 'No filename information in the last part of file content.'
                when 1803 then return 'Upload connection is cancelled.'
                when 1804 then return 'Failed to upload too big file to FAT file system.'
                when 1805 then return 'Can\'t overwrite or skip the existed file, if no overwrite parameter is given.'
        # Sharing API specfic errors
        if api is 'SYNO.FileStation.Sharing'
            switch code
                when 2000 then return 'Sharing link does not exist.'
                when 2001 then return 'Cannot generate sharing link because too many sharing links exist.'
                when 2002 then return 'Failed to access sharing links.'
        # CreateFolder API specific errors
        if api is 'SYNO.FileStation.CreateFolder'
            switch code
                when 1100  then return 'Failed to create a folder. More information in <errors> object.'
                when 1101  then return 'The number of folders to the parent folder would exceed the system limitation.'
        # Rename API specific errors
        if api is 'SYNO.FileStation.Rename'
            switch code
                when 1200 then return 'Failed to rename it. More information in <errors> object.'
        # CopyMove API specific errors
        if api is 'SYNO.FileStation.CopyMove'
            switch code
                when 1000 then return 'Failed to copy files/folders. More information in <errors> object.'
                when 1001 then return 'Failed to move files/folders. More information in <errors> object.'
                when 1002 then return 'An error occurred at the destination. More information in <errors> object.'
                when 1003
                    return 'Cannot overwrite or skip the existing file because no overwrite parameter is given.'
                when 1004
                    return 'File cannot overwrite a folder with the same name, or folder cannot overwrite a file with
                            the same name.'
                when 1006 then return 'Cannot copy/move file/folder with special characters to a FAT32 file system.'
                when 1007 then return 'Cannot copy/move a file bigger than 4G to a FAT32 file system.'
        # Delete API specific errors
        if api is 'SYNO.FileStation.Delete'
            switch code
                when 900 then return 'Failed to delete file(s)/folder(s). More information in <errors> object.'
        # Extract APi specific errors
        if api is 'SYNO.FileStation.Extract'
            switch code
                when 1400 then return 'Failed to extract files.'
                when 1401 then return 'Cannot open the file as archive.'
                when 1402 then return 'Failed to read archive data error'
                when 1403 then return 'Wrong password.'
                when 1404 then return 'Failed to get the file and dir list in an archive.'
                when 1405 then return 'Failed to find the item ID in an archive file.'
        # Compress API specific errors
        if api is 'SYNO.FileStation.Compress'
            switch code
                when 1300 then return 'Failed to compress files/folders.'
                when 1301 then return 'Cannot create the archive because the given archive name is too long.'
        # FileStation specific errors
        switch code
            when 400 then return 'Invalid parameter of file operation'
            when 401 then return 'Unknown error of file operation'
            when 402 then return 'System is too busy'
            when 403 then return 'Invalid user does this file operation'
            when 404 then return 'Invalid group does this file operation'
            when 405 then return 'Invalid user and group does this file operation'
            when 406 then return 'Can\'t get user/group information from the account server'
            when 407 then return 'Operation not permitted'
            when 408 then return 'No such file or directory'
            when 409 then return 'Non-supported file system'
            when 410 then return 'Failed to connect internet-based file system (ex: CIFS)'
            when 411 then return 'Read-only file system'
            when 412 then return 'Filename too long in the non-encrypted file system'
            when 413 then return 'Filename too long in the encrypted file system'
            when 414 then return 'File already exists'
            when 415 then return 'Disk quota exceeded'
            when 416 then return 'No space left on device'
            when 417 then return 'Input/output error'
            when 418 then return 'Illegal name or path'
            when 419 then return 'Illegal file name'
            when 420 then return 'Illegal file name on FAT file system'
            when 421 then return 'Device or resource busy'
            when 599 then return 'No such task of the file operation'
        # No specific error found, so call super function
        return super

    getFileStationInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.FileStation.Info'
                version: 1
                path: 'FileStation/info.cgi'
                method: 'getinfo'
        }

    listSharedFolders: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.FileStation.List'
                version: 1
                path: 'FileStation/file_share.cgi'
                method: 'list_share'
        }

    listFiles: (params, done)->
        @requestAPI {
            params, done
            requiredParams: ['folder_path']
            apiInfos:
                api: 'SYNO.FileStation.List'
                version: 1
                path: 'FileStation/file_share.cgi'
                method: 'list'
        }

    getFilesInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: ['path']
            apiInfos:
                api: 'SYNO.FileStation.List'
                version: 1
                path: 'FileStation/file_share.cgi'
                method: 'getinfo'
        }

    startSearch: (params, done)->
        @requestAPI {
            params, done
            requiredParams: ['folder_path']
            apiInfos:
                api: 'SYNO.FileStation.Search'
                version: 1
                path: 'FileStation/file_find.cgi'
                method: 'start'
        }

    stopSearch: (params, done)->
        @requestAPI {
            params, done
            requiredParams: ['taskid']
            apiInfos:
                api: 'SYNO.FileStation.Search'
                version: 1
                path: 'FileStation/file_find.cgi'
                method: 'stop'
        }

    listSearch: (params, done)->
        @requestAPI {
            params, done
            requiredParams: ['taskid']
            apiInfos:
                api: 'SYNO.FileStation.Search'
                version: 1
                path: 'FileStation/file_find.cgi'
                method: 'list'
        }

    cleanSearches: (params, done)->
        @requestAPI {
            params, done
            requiredParams: ['taskid']
            apiInfos:
                api: 'SYNO.FileStation.Search'
                version: 1
                path: 'FileStation/file_find.cgi'
                method: 'clean'
        }

    listVirtualFolders: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'type' ]
            apiInfos:
                api: 'SYNO.FileStation.VirtualFolder'
                version: 1
                path: 'FileStation/file_virtual.cgi'
                method: 'list'
        }

    listFavorites: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.FileStation.Favorite'
                version: 1
                path: 'FileStation/file_favorite.cgi'
                method: 'list'
        }

    addFavorite: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path', 'name' ]
            apiInfos:
                api: 'SYNO.FileStation.Favorite'
                version: 1
                path: 'FileStation/file_favorite.cgi'
                method: 'list'
        }

    deleteFavorite: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path' ]
            apiInfos:
                api: 'SYNO.FileStation.Favorite'
                version: 1
                path: 'FileStation/file_favorite.cgi'
                method: 'delete'
        }

    cleanBrokenFavorites: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.FileStation.Favorite'
                version: 1
                path: 'FileStation/file_favorite.cgi'
                method: 'delete'
        }

    editFavorite: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path', 'name' ]
            apiInfos:
                api: 'SYNO.FileStation.Favorite'
                version: 1
                path: 'FileStation/file_favorite.cgi'
                method: 'edit'
        }

    replaceAllFavorites: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path', 'name' ]
            apiInfos:
                api: 'SYNO.FileStation.Favorite'
                version: 1
                path: 'FileStation/file_favorite.cgi'
                method: 'replace_all'
        }

    getThumbnail: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path' ]
            apiInfos:
                api: 'SYNO.FileStation.Thumb'
                version: 1
                path: 'FileStation/file_thumb.cgi'
                method: 'get'
        }

    startDirSize: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path' ]
            apiInfos:
                api: 'SYNO.FileStation.DirSize'
                version: 1
                path: 'FileStation/file_dirSize.cgi'
                method: 'start'
        }

    statusDirSize: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.DirSize'
                version: 1
                path: 'FileStation/file_dirSize.cgi'
                method: 'status'
        }

    stopDirSize: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.DirSize'
                version: 1
                path: 'FileStation/file_dirSize.cgi'
                method: 'stop'
        }

    startMD5: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'file_path' ]
            apiInfos:
                api: 'SYNO.FileStation.MD5'
                version: 1
                path: 'FileStation/file_md5.cgi'
                method: 'start'
        }

    statusMD5: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.MD5'
                version: 1
                path: 'FileStation/file_md5.cgi'
                method: 'status'
        }

    stopMD5: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.MD5'
                version: 1
                path: 'FileStation/file_md5.cgi'
                method: 'stop'
        }

    checkWritePermission: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path' ]
            apiInfos:
                api: 'SYNO.FileStation.MD5'
                version: 1
                path: 'FileStation/file_md5.cgi'
                method: 'status'
        }

    getSharingLinkInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.FileStation.Sharing'
                version: 1
                path: 'FileStation/file_sharing.cgi'
                method: 'getinfo'
        }

    listSharingLinks: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.FileStation.Sharing'
                version: 1
                path: 'FileStation/file_sharing.cgi'
                method: 'list'
        }

    createSharingLinks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path' ]
            apiInfos:
                api: 'SYNO.FileStation.Sharing'
                version: 1
                path: 'FileStation/file_sharing.cgi'
                method: 'create'
        }

    deleteSharingLinks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.FileStation.Sharing'
                version: 1
                path: 'FileStation/file_sharing.cgi'
                method: 'delete'
        }

    clearInvalidSharingLinks: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.FileStation.Sharing'
                version: 1
                path: 'FileStation/file_sharing.cgi'
                method: 'clear_invalid'
        }

    editSharingLinks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.FileStation.Sharing'
                version: 1
                path: 'FileStation/file_sharing.cgi'
                method: 'edit'
        }

    createFolder: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path', 'name' ]
            apiInfos:
                api: 'SYNO.FileStation.CreateFolder'
                version: 1
                path: 'FileStation/file_crtfdr.cgi'
                method: 'create'
        }

    rename: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path', 'name' ]
            apiInfos:
                api: 'SYNO.FileStation.Rename'
                version: 1
                path: 'FileStation/file_rename.cgi'
                method: 'rename'
        }

    startCopyMove: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path', 'dest_folder_path' ]
            apiInfos:
                api: 'SYNO.FileStation.CopyMove'
                version: 1
                path: 'FileStation/file_MVCP.cgi'
                method: 'start'
        }

    statusCopyMove: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.CopyMove'
                version: 1
                path: 'FileStation/file_MVCP.cgi'
                method: 'status'
        }

    stopCopyMove: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.CopyMove'
                version: 1
                path: 'FileStation/file_MVCP.cgi'
                method: 'stop'
        }

    startDelete: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path' ]
            apiInfos:
                api: 'SYNO.FileStation.Delete'
                version: 1
                path: 'FileStation/file_delete.cgi'
                method: 'start'
        }

    statusDelete: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.Delete'
                version: 1
                path: 'FileStation/file_delete.cgi'
                method: 'status'
        }

    stopDelete: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.Delete'
                version: 1
                path: 'FileStation/file_delete.cgi'
                method: 'stop'
        }

    delete: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path' ]
            apiInfos:
                api: 'SYNO.FileStation.Delete'
                version: 1
                path: 'FileStation/file_delete.cgi'
                method: 'delete'
        }

    startExtract: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'file_path', 'dest_folder_path' ]
            apiInfos:
                api: 'SYNO.FileStation.Extract'
                version: 1
                path: 'FileStation/file_extract.cgi'
                method: 'start'
        }

    statusExtract: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.Extract'
                version: 1
                path: 'FileStation/file_extract.cgi'
                method: 'status'
        }

    stopExtract: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.Extract'
                version: 1
                path: 'FileStation/file_extract.cgi'
                method: 'stop'
        }

    listArchiveFiles: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'file_path' ]
            apiInfos:
                api: 'SYNO.FileStation.Extract'
                version: 1
                path: 'FileStation/file_extract.cgi'
                method: 'list'
        }

    startCompress: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'path', 'dest_file_path' ]
            apiInfos:
                api: 'SYNO.FileStation.Compress'
                version: 1
                path: 'FileStation/file_compress.cgi'
                method: 'start'
        }

    statusCompress: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.Compress'
                version: 1
                path: 'FileStation/file_compress.cgi'
                method: 'status'
        }

    stopCompress: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.FileStation.Compress'
                version: 1
                path: 'FileStation/file_compress.cgi'
                method: 'stop'
        }

    listBackgroundTasks: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.FileStation.BackgroundTask'
                version: 1
                path: 'FileStation/background_task.cgi'
                method: 'list'
        }

    clearFinishedBackgroundTasks: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.FileStation.BackgroundTask'
                version: 1
                path: 'FileStation/background_task.cgi'
                method: 'clear_finished'
        }

    # Private
    upload = (syno, params, done)->
        {params, done} = Utils.optionalParamsAndDone {params, done}
        Utils.checkRequiredParams params, [ 'dest_folder_path', 'filename' ]

        {protocol, host, port} = syno

        api = 'SYNO.FileStation.Upload'
        version = '1'
        path = 'FileStation/api_upload.cgi'
        method = 'upload'

        url = "#{protocol}://#{host}:#{port}/webapi/#{path}"
        formData = defaults {api, version, method}, params

        syno.request.post {url, formData}, (error, response, data)->
            if error then return done error
            if response.statusCode isnt 200 then return done response.statusCode
            if not data.success then return done data.error
            done null

    upload: (params, done)->
        syno = @syno
        if syno.session then upload syno, params, done
        else syno.auth.login (error)-> if error then done error else upload syno, params, done

    # Private
    download = (syno, params, done)->
        {params, done} = Utils.optionalParamsAndDone {params, done}
        Utils.checkRequiredParams params, [ 'path', 'stream' ]

        stream = params.stream
        delete params.stream

        {protocol, host, port} = syno

        api = 'SYNO.FileStation.Download'
        version = 1
        path = 'FileStation/file_download.cgi'
        method = 'download'

        url = "#{protocol}://#{host}:#{port}/webapi/#{path}"
        qs = defaults {api, version, method}, params

        syno.request {url, qs, json: false}
            .on 'error', (error)-> done error
            .on 'end', -> done null
            .pipe stream

    download: (params, done)->
        syno = @syno
        if syno.session then download syno, params, done
        else syno.auth.login (error)-> if error then done error else download syno, params, done
        
    getMethods: (params, done)->
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered
