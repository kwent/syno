# Require lodash functions
{defaults} = require 'lodash'

# Get syno modules
AuthenticatedAPI = mod syno.AuthenticatedAPI
Utils = mod syno.Utils

class FileStation extends AuthenticatedAPI

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