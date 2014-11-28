# Require external libs --

fs = require "fs"
_ = require "lodash"
request = require "request"

# No operation function
noop = ->

# Creates API Method based on `args` parameter
# `args.apiInfos`           [Object]
# `args.apiInfos.api`       [String] API name
# `args.apiInfos.version`   [String] API version
# `args.apiInfos.path`      [String] API path
# `args.apiInfos.method`    [String] API method
# `args.requiredParams`     [String[]] List of required parameters for the API
createAPIMethod = (args)->
    {apiInfos, requiredParams} = args

    (params, done)->
        # Process optional parameters and done callback
        {params, done} = @optionalParamsAndDone {params, done}
        # Check that required parmeters are passed
        @requiredParams params, requiredParams
        # Create request options based on parameters and api infos
        opts = _.extend {}, apiInfos, {params}
        # Call request with options and done callback
        @request opts, done

# Class Syno
class Syno
    # Defaults properties
    defaults:
        # Default protocol is HTTP (`http`)
        protocol: "http"
        # Default host is `localhost`
        host: "localhost"
        # Default port is `5000`
        port: 5000

    # Constructor for the Syno class
    # `params`          [Object]
    # `params.account`  [String] Account for the syno instance. * Required *
    # `params.passwd`   [String] Password for the account. * Required *
    # `params.protocol` [String] Protocol for the syno requests.
    # `params.host`     [String] Host of the syno.
    # `params.port`     [String] Port for the syno requests.
    constructor: (params)->
        # Use defaults options
        _.defaults @, params, @defaults
        # Throw errors if required params are not passed
        throw new Error "Did not specified `account` for syno" if not @account
        throw new Error "Did not specified `passwd` for syno" if not @passwd

        # Create request with jar
        @request = request.defaults jar: true, json: true
        # Init session property
        @session = null

        # Add auth API
        @auth = new Auth @
        # Add FileStation API
        @fs = @fileStation = new FileStation @
        # Add Download Station API
        @dl = @downloadStation = new DownloadStation @

# Class API
class API
    # Constructor for the API class
    # `syno` [Syno] The syno instance linked to the API instance
    constructor: (@syno)->

    # Request to the syno and process generic response
    # `options`         [Object]
    # `options.api`     [String] API name
    # `options.version` [String] API version
    # `options.path`    [String] API path
    # `options.method`  [String] API method
    # `options.params`  [Object] API parameters
    request: (options, done)->
        # Get protocol, host and port variables from syno instance
        {protocol, host, port} = @syno
        # Get api, version, path, method, params variables from options
        {api, version, path, method, params} = options

        # Create url from protocol, host, port and path
        url = "#{protocol}://#{host}:#{port}/webapi/#{path}"
        # Create querystring from api, verison and method
        qs = _.defaults {api, version, method}, params

        # Launch syno request with url and querystring
        @syno.request {url, qs}, (error, response, body)->
            # Call done callback with error if there is an error
            return done error if error
            # Call done callback with statusCode error if there is an error with the response
            return done response.statusCode if response.statusCode isnt 200
            # Call done callback with error if there is an error server side
            return done JSON.stringify body.error, null, 4 if not body.success
            # Call done callback with no error and the data property of the response
            return done null, body.data

    # Processes optional parameters and done callback
    # `options`         [Object]
    # `options.params`  [Object]    Parameters object.
    # `options.done`    [Function]  Done callback.
    optionalParamsAndDone: (options)->
        # Get params and done varaibles from options
        {params, done} = options

        # If the done function is not defined, then use the params if it is a function, or use the no operation function
        if not done
            done = if _.isFunction params then params else noop

        # If params is not a plain object, use an empty one
        if not _.isPlainObject params
            params = {}

        # Return processed params and done callback
        return {params, done}

    # Check if required parameters are present in `params`
    # If a required param is not present, raise an Error
    requiredParams: (params, required=[])->
        # For each required params, if it is not present in the params argument, raise an Error
        _.each required, (key)-> throw new Error "#{key} param is required" if not params[key]

# Auth API
class Auth extends API
    # API name
    api: "SYNO.API.Auth"
    # API version
    version: 3
    # API path
    path: "auth.cgi"

    # Login to Syno
    # `done` [Function] Callback called when the login processed is complete
    login: (done)->
        # Make the done function optional
        {done} = @optionalParamsAndDone {done}

        # API method is `login`
        method = "login"
        # Use a unique session
        session = "SYNO_SESSION_"+_.now()
        # Init teh request parameters
        params =
            account: @syno.account
            passwd: @syno.passwd
            session: session
        # Set the syno session name
        @syno.session = session

        # Request login
        @request {@api, @version, @path, method, params}, (error, data)->
            # Call done callback with error if there is one
            return done error if error
            # Call done callback with no error and the data associated with the login process
            return done null, data

    # Logout to syno
    logout: (done)->
        # Don't do anything if there is no session
        return null if not @syno.session

        # Make the done function optional
        {done} = @optionalParamsAndDone {done}

        # API method is `logout`
        method = "logout"
        # Init logout parameters
        params =
            session: @syno.session

        # Remove session property of syno
        @syno.session = null

        # Request logout
        @request {@api, @version, @path, method, params}, done

# Authenticated API
# API that logs in before calling real request
class AuthenticatedAPI extends API

    # Overrides request : login before calling real request
    request: (options, done)->
        # If session property is set, call real request
        if @syno.session
            super options, done
        # Else login then call real request
        else
            @syno.auth.login (error)=>
                return done error if error
                @request options, done

# FileStation API
class FileStation extends AuthenticatedAPI

    getFileStationInfo: createAPIMethod
        apiInfos:
            api: "SYNO.FileStation.Info"
            version: 1
            path: "FileStation/info.cgi"
            method: "getinfo"

    listSharedFolders: createAPIMethod
        apiInfos:
            api: "SYNO.FileStation.List"
            version: 1
            path: "FileStation/file_share.cgi"
            method: "list_share"

    listFiles: createAPIMethod
        requiredParams: [ "folder_path" ]
        apiInfos:
            api: "SYNO.FileStation.List"
            version: 1
            path: "FileStation/file_share.cgi"
            method: "list"

    getFilesInfo: createAPIMethod
        requiredParams: [ "path" ]
        apiInfos:
            api: "SYNO.FileStation.List"
            version: 1
            path: "FileStation/file_share.cgi"
            method: "getinfo"

    startSearch: createAPIMethod
        requiredParams: [ "folder_path" ]
        apiInfos:
            api: "SYNO.FileStation.Search"
            version: 1
            path: "FileStation/file_find.cgi"
            method: "start"

    stopSearch: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.Search"
            version: 1
            path: "FileStation/file_find.cgi"
            method: "stop"

    listSearch: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.Search"
            version: 1
            path: "FileStation/file_find.cgi"
            method: "list"

    cleanSearches: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.Search"
            version: 1
            path: "FileStation/file_find.cgi"
            method: "clean"

    listVirtualFolders: createAPIMethod
        requiredParams: [ "type" ]
        apiInfos:
            api: "SYNO.FileStation.VirtualFolder"
            version: 1
            path: "FileStation/file_virtual.cgi"
            method: "list"

    listFavorites: createAPIMethod
        apiInfos:
            api: "SYNO.FileStation.Favorite"
            version: 1
            path: "FileStation/file_favorite.cgi"
            method: "list"

    addFavorite: createAPIMethod
        requiredParams: [ "path", "name" ]
        apiInfos:
            api: "SYNO.FileStation.Favorite"
            version: 1
            path: "FileStation/file_favorite.cgi"
            method: "list"

    deleteFavorite: createAPIMethod
        requiredParams: [ "path" ]
        apiInfos:
            api: "SYNO.FileStation.Favorite"
            version: 1
            path: "FileStation/file_favorite.cgi"
            method: "delete"

    cleanBrokenFavorites: createAPIMethod
        options :
            api: "SYNO.FileStation.Favorite"
            version: 1
            path: "FileStation/file_favorite.cgi"
            method: "delete"

    editFavorite: createAPIMethod
        requiredParams: [ "path", "name" ]
        apiInfos:
            api: "SYNO.FileStation.Favorite"
            version: 1
            path: "FileStation/file_favorite.cgi"
            method: "edit"

    replaceAllFavorites: createAPIMethod
        requiredParams: [ "path", "name" ]
        apiInfos:
            api: "SYNO.FileStation.Favorite"
            version: 1
            path: "FileStation/file_favorite.cgi"
            method: "replace_all"

    getThumbnail: createAPIMethod
        requiredParams: [ "path" ]
        apiInfos:
            api: "SYNO.FileStation.Thumb"
            version: 1
            path: "FileStation/file_thumb.cgi"
            method: "get"

    startDirSize: createAPIMethod
        requiredParams: [ "path" ]
        apiInfos:
            api: "SYNO.FileStation.DirSize"
            version: 1
            path: "FileStation/file_dirSize.cgi"
            method: "start"

    statusDirSize: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.DirSize"
            version: 1
            path: "FileStation/file_dirSize.cgi"
            method: "status"

    stopDirSize: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.DirSize"
            version: 1
            path: "FileStation/file_dirSize.cgi"
            method: "stop"

    startMD5: createAPIMethod
        requiredParams: [ "file_path" ]
        apiInfos:
            api: "SYNO.FileStation.MD5"
            version: 1
            path: "FileStation/file_md5.cgi"
            method: "start"

    statusMD5: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.MD5"
            version: 1
            path: "FileStation/file_md5.cgi"
            method: "status"

    stopMD5: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.MD5"
            version: 1
            path: "FileStation/file_md5.cgi"
            method: "stop"

    # TODO Make it better : There is an error when logged user does not have write permission
    checkWritePermission: createAPIMethod
        requiredParams: [ "path" ]
        apiInfos:
            api: "SYNO.FileStation.MD5"
            version: 1
            path: "FileStation/file_md5.cgi"
            method: "status"

    upload: (params, done)->
        upload = (params, done)=>
            {params, done} = @optionalParamsAndDone {params, done}
            @requiredParams params, [ "dest_folder_path", "filename" ]

            {protocol, host, port} = @syno

            api = "SYNO.FileStation.Upload"
            version = "1"
            path = "FileStation/api_upload.cgi"
            method = "upload"

            url = "#{protocol}://#{host}:#{port}/webapi/#{path}"
            formData = _.defaults {api, version, method}, params

            @syno.request.post {url, formData}, (error, response, data)->
                return done error if error
                return done response.statusCode if response.statusCode isnt 200
                return done data.error if not data.success
                return done null

        if @syno.session
            upload params, done
        else
            @syno.auth.login (error)=>
                return done error if error
                upload params, done

    download: (params, done)->
        download = (params, done)=>
            {params, done} = @optionalParamsAndDone {params, done}
            @requiredParams params, [ "path", "stream" ]

            stream = params.stream
            delete params.stream

            {protocol, host, port} = @syno

            api = "SYNO.FileStation.Download"
            version = 1
            path = "FileStation/file_download.cgi"
            method = "download"

            url = "#{protocol}://#{host}:#{port}/webapi/#{path}"
            qs = _.defaults {api, version, method}, params

            @syno.request({url, qs, json: false}).pipe stream

        if @syno.session
            download params, done
        else
            @syno.auth.login (error)=>
                return done error if error
                download params, done

    getSharingLinkInfo: createAPIMethod
        requiredParams: [ "id" ]
        apiInfos:
            api: "SYNO.FileStation.Sharing"
            version: 1
            path: "FileStation/file_sharing.cgi"
            method: "getinfo"

    listSharingLinks: createAPIMethod
        apiInfos:
            api: "SYNO.FileStation.Sharing"
            version: 1
            path: "FileStation/file_sharing.cgi"
            method: "list"

    createSharingLinks: createAPIMethod
        requiredParams: [ "path" ]
        apiInfos:
            api: "SYNO.FileStation.Sharing"
            version: 1
            path: "FileStation/file_sharing.cgi"
            method: "create"

    deleteSharingLinks: createAPIMethod
        requiredParams: [ "id" ]
        apiInfos:
            api: "SYNO.FileStation.Sharing"
            version: 1
            path: "FileStation/file_sharing.cgi"
            method: "delete"

    clearInvalidSharingLinks: createAPIMethod
        apiInfos:
            api: "SYNO.FileStation.Sharing"
            version: 1
            path: "FileStation/file_sharing.cgi"
            method: "clear_invalid"

    editSharingLinks: createAPIMethod
        requiredParams: [ "id" ]
        apiInfos:
            api: "SYNO.FileStation.Sharing"
            version: 1
            path: "FileStation/file_sharing.cgi"
            method: "edit"
            
    createFolder: createAPIMethod
        requiredParams: [ "path", "name" ]
        apiInfos:
            api: "SYNO.FileStation.CreateFolder"
            version: 1
            path: "FileStation/file_crtfdr.cgi"
            method: "create"

    rename: createAPIMethod
        requiredParams: [ "path", "name" ]
        apiInfos:
            api: "SYNO.FileStation.Rename"
            version: 1
            path: "FileStation/file_rename.cgi"
            method: "rename"

    startCopyMove: createAPIMethod
        requiredParams: [ "path", "dest_folder_path" ]
        apiInfos:
            api: "SYNO.FileStation.CopyMove"
            version: 1
            path: "FileStation/file_MVCP.cgi"
            method: "start"

    statusCopyMove: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.CopyMove"
            version: 1
            path: "FileStation/file_MVCP.cgi"
            method: "status"
            
    stopCopyMove: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.CopyMove"
            version: 1
            path: "FileStation/file_MVCP.cgi"
            method: "stop"
            
    startDelete: createAPIMethod
        requiredParams: [ "path" ]
        apiInfos:
            api: "SYNO.FileStation.Delete"
            version: 1
            path: "FileStation/file_delete.cgi"
            method: "start"

    statusDelete: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.Delete"
            version: 1
            path: "FileStation/file_delete.cgi"
            method: "status"

    stopDelete: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.Delete"
            version: 1
            path: "FileStation/file_delete.cgi"
            method: "stop"

    delete: createAPIMethod
        requiredParams: [ "path" ]
        apiInfos:
            api: "SYNO.FileStation.Delete"
            version: 1
            path: "FileStation/file_delete.cgi"
            method: "delete"

    startExtract: createAPIMethod
        requiredParams: [ "file_path", "dest_folder_path" ]
        apiInfos:
            api: "SYNO.FileStation.Extract"
            version: 1
            path: "FileStation/file_extract.cgi"
            method: "start"

    statusExtract: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.Extract"
            version: 1
            path: "FileStation/file_extract.cgi"
            method: "status"

    stopExtract: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.Extract"
            version: 1
            path: "FileStation/file_extract.cgi"
            method: "stop"

    listArchiveFiles: createAPIMethod
        requiredParams: [ "file_path" ]
        apiInfos:
            api: "SYNO.FileStation.Extract"
            version: 1
            path: "FileStation/file_extract.cgi"
            method: "list"

    startCompress: createAPIMethod
        requiredParams: [ "path", "dest_file_path" ]
        apiInfos:
            api: "SYNO.FileStation.Compress"
            version: 1
            path: "FileStation/file_compress.cgi"
            method: "start"

    statusCompress: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.Compress"
            version: 1
            path: "FileStation/file_compress.cgi"
            method: "status"

    stopCompress: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.FileStation.Compress"
            version: 1
            path: "FileStation/file_compress.cgi"
            method: "stop"

    listBackgroundTasks: createAPIMethod
        apiInfos:
            api: "SYNO.FileStation.BackgroundTask"
            version: 1
            path: "FileStation/background_task.cgi"
            method: "list"

    clearFinishedBackgroundTasks: createAPIMethod
        apiInfos:
            api: "SYNO.FileStation.BackgroundTask"
            version: 1
            path: "FileStation/background_task.cgi"
            method: "clear_finished"

# DownloadStation API
class DownloadStation extends AuthenticatedAPI

    getDownloadStationInfo: createAPIMethod
        apiInfos:
            api: "SYNO.DownloadStation.Info"
            version: 1
            path: "DownloadStation/info.cgi"
            method: "getinfo"

    setDownloadStationConfig: createAPIMethod
        apiInfos:
            api: "SYNO.DownloadStation.Info"
            version: 1
            path: "DownloadStation/info.cgi"
            method: "setserverconfig"

    getScheduleConfig: createAPIMethod
        apiInfos:
            api: "SYNO.DownloadStation.Schedule"
            version: 1
            path: "DownloadStation/schedule.cgi"
            method: "getconfig"

    setScheduleConfig: createAPIMethod
        apiInfos:
            api: "SYNO.DownloadStation.Schedule"
            version: 1
            path: "DownloadStation/schedule.cgi"
            method: "setconfig"

    listTasks: createAPIMethod
        apiInfos:
            api: "SYNO.DownloadStation.Task"
            version: 1
            path: "DownloadStation/task.cgi"
            method: "list"

    getTasksInfo: createAPIMethod
        requiredParams: [ "id" ]
        apiInfos:
            api: "SYNO.DownloadStation.Task"
            version: 1
            path: "DownloadStation/task.cgi"
            method: "getinfo"

    createTask: createAPIMethod
        apiInfos:
            api: "SYNO.DownloadStation.Task"
            version: 3
            path: "DownloadStation/task.cgi"
            method: "create"

    deleteTasks: createAPIMethod
        requiredParams: [ "id" ]
        apiInfos:
            api: "SYNO.DownloadStation.Task"
            version: 1
            path: "DownloadStation/task.cgi"
            method: "delete"

    pauseTasks: createAPIMethod
        requiredParams: [ "id" ]
        apiInfos:
            api: "SYNO.DownloadStation.Task"
            version: 1
            path: "DownloadStation/task.cgi"
            method: "pause"

    resumeTasks: createAPIMethod
        requiredParams: [ "id" ]
        apiInfos:
            api: "SYNO.DownloadStation.Task"
            version: 1
            path: "DownloadStation/task.cgi"
            method: "resume"

    editTasks: createAPIMethod
        requiredParams: [ "id" ]
        apiInfos:
            api: "SYNO.DownloadStation.Task"
            version: 2
            path: "DownloadStation/task.cgi"
            method: "edit"

    getStats: createAPIMethod
        apiInfos:
            api: "SYNO.DownloadStation.Statistic"
            version: 1
            path: "DownloadStation/statistic.cgi"
            method: "getinfo"

    listRSSSites: createAPIMethod
        apiInfos:
            api: "SYNO.DownloadStation.RSS.Site"
            version: 1
            path: "DownloadStation/RSSsite.cgi"
            method: "list"

    refreshRSSSites: createAPIMethod
        requiredParams: [ "id" ]
        apiInfos:
            api: "SYNO.DownloadStation.RSS.Site"
            version: 1
            path: "DownloadStation/RSSsite.cgi"
            method: "refresh"

    listRSSFeeds: createAPIMethod
        apiInfos:
            api: "SYNO.DownloadStation.RSS.Feed"
            version: 1
            path: "DownloadStation/RSSfeed.cgi"
            method: "list"

    startBTSearch: createAPIMethod
        requiredParams: [ "keyword", "module" ]
        apiInfos:
            api: "SYNO.DownloadStation.BTSearch"
            version: 1
            path: "DownloadStation/btsearch.cgi"
            method: "start"

    listBTSearch: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.DownloadStation.BTSearch"
            version: 1
            path: "DownloadStation/btsearch.cgi"
            method: "start"

    getBTSearchCategories: createAPIMethod
        apiInfos:
            api: "SYNO.DownloadStation.BTSearch"
            version: 1
            path: "DownloadStation/btsearch.cgi"
            method: "getCategory"

    cleanBTSearch: createAPIMethod
        requiredParams: [ "taskid" ]
        apiInfos:
            api: "SYNO.DownloadStation.BTSearch"
            version: 1
            path: "DownloadStation/btsearch.cgi"
            method: "clean"

    getBTSearchModules: createAPIMethod
        apiInfos:
            api: "SYNO.DownloadStation.BTSearch"
            version: 1
            path: "DownloadStation/btsearch.cgi"
            method: "getModule"

module.exports = Syno