# Require lodash functions
{extend, defaults} = require 'lodash'

# Get syno utils module
Utils = mod syno.Utils

# Class API
class API

    # Errors
    errors =
      100: 'Unknown error'
      101: 'Invalid parameter'
      102: 'The requested API does not exist'
      103: 'The requested method does not exist'
      104: 'The requested version does not support the functionality'
      105: 'The logged in session does not have permission'
      106: 'Session timeout'
      107: 'Session interrupted by duplicate login'
      400: 'No such account or incorrect password'
      401: 'Account disabled'
      402: 'Permission denied'
      403: '2-step verification code required'
      404: '￼Failed to authenticate 2-step verification code'
    
    # Private noop class
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
            if not body.success
              error = new Error(errors[body.error.code] or errors[100])
              return done error.toString()
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