# Require lodash functions
{extend, defaults, isEmpty, mapValues} = require 'lodash'

# Class API
class API

    # Handle API errors
    error: (code)->
        switch code
            when 101 then 'No parameter of API, method or version'
            when 102 then 'The requested API does not exist'
            when 103 then 'The requested method does not exist'
            when 104 then 'The requested version does not support the functionality'
            when 105 then 'The logged in session does not have permission'
            when 106 then 'Session timeout'
            when 107 then 'Session interrupted by duplicate login'
            else 'Unknown error'

    # Privat noop class
    noop = ->

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
    request: (options = {}, done = noop)->
        # Get protocol, host and port variables from syno instance
        {protocol, host, port} = @syno
        # Get api, version, path, method, params variables from options
        {api, version, path, method, params} = options

        # Create url from protocol, host, port and path
        url = "#{protocol}://#{host}:#{port}/webapi/#{path}"
        # Create querystring from api, verison and method
        qs = defaults {api, version, method}, params

        # Launch syno request with url and querystring
        @syno.request {url, qs}, (error, response, body)=>
            # Call done callback with error if there is an error
            if error then return done error
            # Call done callback with statusCode error if there is an error with the response
            if response.statusCode isnt 200
                error = new Error "HTTP status code: #{response.statusCode}"
                error.response = response
                return done error
            # Call done callback with error if there is an error server side
            if not body.success
                code = body.error.code
                error = new Error @error code, api
                error.code = code
                error.errors = body.error.errors
                return done error
            # Call done callback with no error and the data property of the response
            done null, body.data

    # Request API using `args` parameter
    # `args.params`             [Object] Request Parameters
    # `args.done`               [Function] Done callback
    # `args.apiInfos`           [Object]
    # `args.apiInfos.api`       [String] API name
    # `args.apiInfos.version`   [String] API version
    # `args.apiInfos.path`      [String] API path
    # `args.apiInfos.method`    [String] API method
    # `args.requiredParams`     [String[]] List of required parameters for the API
    requestAPI: (args)->
        {apiInfos, requiredParams, params, done} = args

        # Process optional parameters and done callback
        {params, done} = Utils.optionalParamsAndDone {params, done}
        # Force params to be string if they can be converted to strings (boolean, numbers...)
        params = mapValues params, (param)-> param and param.toString()
        # Check that required parmeters are passed
        missing = Utils.checkRequiredParams params, requiredParams
        # If the missing params array is not empty, stop everything
        if not isEmpty missing then return done new Error "Missing required params: #{missing.join(', ')}"
        # Create request options based on parameters and api infos
        opts = extend {}, apiInfos, {params}
        # Call request with options and done callback
        @request opts, done