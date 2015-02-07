AuthenticatedAPI = mod syno.AuthenticatedAPI

# DownloadStation API
class DownloadStation extends AuthenticatedAPI

    getDownloadStationInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.DownloadStation.Info"
                version: 1
                path: "DownloadStation/info.cgi"
                method: "getinfo"
        }

    setDownloadStationConfig: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.DownloadStation.Info"
                version: 1
                path: "DownloadStation/info.cgi"
                method: "setserverconfig"
        }

    getScheduleConfig: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.DownloadStation.Schedule"
                version: 1
                path: "DownloadStation/schedule.cgi"
                method: "getconfig"
        }

    setScheduleConfig: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.DownloadStation.Schedule"
                version: 1
                path: "DownloadStation/schedule.cgi"
                method: "setconfig"
        }

    listTasks: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.DownloadStation.Task"
                version: 1
                path: "DownloadStation/task.cgi"
                method: "list"
        }

    getTasksInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ "id" ]
            apiInfos:
                api: "SYNO.DownloadStation.Task"
                version: 1
                path: "DownloadStation/task.cgi"
                method: "getinfo"
        }

    createTask: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.DownloadStation.Task"
                version: 3
                path: "DownloadStation/task.cgi"
                method: "create"
        }

    deleteTasks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ "id" ]
            apiInfos:
                api: "SYNO.DownloadStation.Task"
                version: 1
                path: "DownloadStation/task.cgi"
                method: "delete"
        }

    pauseTasks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ "id" ]
            apiInfos:
                api: "SYNO.DownloadStation.Task"
                version: 1
                path: "DownloadStation/task.cgi"
                method: "pause"
        }

    resumeTasks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ "id" ]
            apiInfos:
                api: "SYNO.DownloadStation.Task"
                version: 1
                path: "DownloadStation/task.cgi"
                method: "resume"
        }

    editTasks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ "id" ]
            apiInfos:
                api: "SYNO.DownloadStation.Task"
                version: 2
                path: "DownloadStation/task.cgi"
                method: "edit"
        }

    getStats: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.DownloadStation.Statistic"
                version: 1
                path: "DownloadStation/statistic.cgi"
                method: "getinfo"
        }

    listRSSSites: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.DownloadStation.RSS.Site"
                version: 1
                path: "DownloadStation/RSSsite.cgi"
                method: "list"
        }

    refreshRSSSites: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ "id" ]
            apiInfos:
                api: "SYNO.DownloadStation.RSS.Site"
                version: 1
                path: "DownloadStation/RSSsite.cgi"
                method: "refresh"
        }

    listRSSFeeds: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.DownloadStation.RSS.Feed"
                version: 1
                path: "DownloadStation/RSSfeed.cgi"
                method: "list"
        }

    startBTSearch: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ "keyword", "module" ]
            apiInfos:
                api: "SYNO.DownloadStation.BTSearch"
                version: 1
                path: "DownloadStation/btsearch.cgi"
                method: "start"
        }

    listBTSearch: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ "taskid" ]
            apiInfos:
                api: "SYNO.DownloadStation.BTSearch"
                version: 1
                path: "DownloadStation/btsearch.cgi"
                method: "start"
        }

    getBTSearchCategories: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.DownloadStation.BTSearch"
                version: 1
                path: "DownloadStation/btsearch.cgi"
                method: "getCategory"
        }

    cleanBTSearch: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ "taskid" ]
            apiInfos:
                api: "SYNO.DownloadStation.BTSearch"
                version: 1
                path: "DownloadStation/btsearch.cgi"
                method: "clean"
        }

    getBTSearchModules: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.DownloadStation.BTSearch"
                version: 1
                path: "DownloadStation/btsearch.cgi"
                method: "getModule"
        }