class DownloadStation extends AuthenticatedAPI

    getDownloadStationInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.Info'
                version: 1
                path: 'DownloadStation/info.cgi'
                method: 'getinfo'
        }

    getDownloadStationConfig: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.Info'
                version: 1
                path: 'DownloadStation/info.cgi'
                method: 'getconfig'
        }

    setDownloadStationConfig: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.Info'
                version: 1
                path: 'DownloadStation/info.cgi'
                method: 'setserverconfig'
        }

    getScheduleConfig: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.Schedule'
                version: 1
                path: 'DownloadStation/schedule.cgi'
                method: 'getconfig'
        }

    setScheduleConfig: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.Schedule'
                version: 1
                path: 'DownloadStation/schedule.cgi'
                method: 'setconfig'
        }

    listTasks: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.Task'
                version: 1
                path: 'DownloadStation/task.cgi'
                method: 'list'
        }

    getTasksInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.DownloadStation.Task'
                version: 1
                path: 'DownloadStation/task.cgi'
                method: 'getinfo'
        }

    createTask: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.Task'
                version: 3
                path: 'DownloadStation/task.cgi'
                method: 'create'
        }

    deleteTasks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.DownloadStation.Task'
                version: 1
                path: 'DownloadStation/task.cgi'
                method: 'delete'
        }

    pauseTasks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.DownloadStation.Task'
                version: 1
                path: 'DownloadStation/task.cgi'
                method: 'pause'
        }

    resumeTasks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.DownloadStation.Task'
                version: 1
                path: 'DownloadStation/task.cgi'
                method: 'resume'
        }

    editTasks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.DownloadStation.Task'
                version: 2
                path: 'DownloadStation/task.cgi'
                method: 'edit'
        }

    getStats: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.Statistic'
                version: 1
                path: 'DownloadStation/statistic.cgi'
                method: 'getinfo'
        }

    listRSSSites: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.RSS.Site'
                version: 1
                path: 'DownloadStation/RSSsite.cgi'
                method: 'list'
        }

    refreshRSSSites: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.DownloadStation.RSS.Site'
                version: 1
                path: 'DownloadStation/RSSsite.cgi'
                method: 'refresh'
        }

    listRSSFeeds: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.RSS.Feed'
                version: 1
                path: 'DownloadStation/RSSfeed.cgi'
                method: 'list'
        }

    startBTSearch: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'keyword', 'module' ]
            apiInfos:
                api: 'SYNO.DownloadStation.BTSearch'
                version: 1
                path: 'DownloadStation/btsearch.cgi'
                method: 'start'
        }

    listBTSearch: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.DownloadStation.BTSearch'
                version: 1
                path: 'DownloadStation/btsearch.cgi'
                method: 'start'
        }

    getBTSearchCategories: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.BTSearch'
                version: 1
                path: 'DownloadStation/btsearch.cgi'
                method: 'getCategory'
        }

    cleanBTSearch: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'taskid' ]
            apiInfos:
                api: 'SYNO.DownloadStation.BTSearch'
                version: 1
                path: 'DownloadStation/btsearch.cgi'
                method: 'clean'
        }

    getBTSearchModules: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DownloadStation.BTSearch'
                version: 1
                path: 'DownloadStation/btsearch.cgi'
                method: 'getModule'
        }
        
    getMethods: (params, done)->
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered

    # Handle Download Station specific errors
    error: (code, api)->
        # Task API specific errors
        if api is 'SYNO.DownloadStation.Task'
            switch code
                when 400 then return 'File upload failed'
                when 401 then return 'Max number of tasks reached'
                when 402 then return 'Destination denied'
                when 403 then return 'Destination does not exist'
                when 404 then return 'Invalid task id'
                when 405 then return 'Invalid task action'
                when 406 then return 'No default destination'
                when 407 then return 'Set destination failed'
                when 408 then return 'File does not exist'
        # BTSearch API specific errors
        if api is 'SYNO.DownloadStation.BTSearch'
            switch code
                when 400 then return 'Unknown error'
                when 401 then return 'Invalid parameter'
                when 402 then return 'Parse the user setting failed'
                when 403 then return 'Get category failed'
                when 404 then return 'Get the search result from DB failed'
                when 405 then return 'Get the user setting failed'
        # Did not find any specifi error, so call super function
        return super