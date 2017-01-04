class DownloadStation extends AuthenticatedAPI

    constructor: (@syno)->
        super(@syno)
        @syno.session = 'DownloadStation'
        @syno.createFunctionsFor(this, ['SYNO.DownloadStation'])

    getMethods: (params, done)->
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error']
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