# Require lodash functions
{extend, defaults} = require 'lodash'

# Get syno utils module
Utils = mod syno.Utils

# Class API
class API

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
    request: (options={}, done=noop)->
        # Get protocol, host and port variables from syno instance
        {protocol, host, port} = @syno
        # Get api, version, path, method, params variables from options
        {api, version, path, method, params} = options

        # Create url from protocol, host, port and path
        url = "#{protocol}://#{host}:#{port}/webapi/#{path}"
        # Create querystring from api, verison and method
        qs = defaults {api, version, method}, params

        # Launch syno request with url and querystring
        @syno.request {url, qs}, (error, response, body)->
            # Call done callback with error if there is an error
            if error then return done error
            # Call done callback with statusCode error if there is an error with the response
            if response.statusCode isnt 200 then return done response.statusCode
            # Call done callback with error if there is an error server side
            if not body.success then return done JSON.stringify body.error, null, 4
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
        # Check that required parmeters are passed
        Utils.checkRequiredParams params, requiredParams
        # Create request options based on parameters and api infos
        opts = extend {}, apiInfos, {params}
        # Call request with options and done callback
        @request opts, done