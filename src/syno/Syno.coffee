# Require node modules
request = require 'request'
fs = require 'fs'
path = require 'path'
{defaults, mapValues, keys, values, flatten, filter,
first, last, some, merge, isArray, startsWith, endsWith} = require 'lodash'

# Class Syno
class Syno

    # Default synology parameters
    defParams =
        # Default account is null
        account: process.env.SYNO_ACCOUNT
        # Default password is null
        passwd: process.env.SYNO_PASSWORD
        # Default protocol is HTTP (`http`)
        protocol: process.env.SYNO_PROTOCOL or 'http'
        # Default host is `localhost`
        host: process.env.SYNO_HOST or 'localhost'
        # Default port is `5000`
        port: process.env.SYNO_PORT or 5000
        # Default api version is `6.0.2`
        apiVersion: process.env.SYNO_API_VERSION or '6.0.2'
        # Default debug flag is `false`
        debug: process.env.SYNO_DEBUG or false
        # Default ignore certificate errors
        ignoreCertificateErrors: process.env.SYNO_IGNORE_CERTIFICATE_ERRORS or false
        # Otp key for generation auth code
        otp: process.env.SYNO_OTP

    apiVersionsAvailable = ['5.0', '5.1', '5.2', '6.0', '6.0.1', '6.0.2']

    # Constructor for the Syno class
    # `params`             [Object]
    # `params.account`     [String] Account for the syno instance. * Required *
    # `params.passwd`      [String] Password for the account. * Required *
    # `params.protocol`    [String] Protocol for the syno requests.
    # `params.host`        [String] Host of the syno.
    # `params.port`        [String] Port for the syno requests.
    # `params.apiVersion`  [String] DSM api version.
    # `params.aot`         [String] Otp key for generation auth code.
    constructor: (params)->
        # Use defaults options
        defaults this, params, defParams

        # Debug mode
        console.log "[DEBUG] : Account: #{@account}" if @debug
        console.log "[DEBUG] : Password: #{@passwd}" if @debug
        console.log "[DEBUG] : Host: #{@host}" if @debug
        console.log "[DEBUG] : Port: #{@port}" if @debug
        console.log "[DEBUG] : API: #{@apiVersion}" if @debug
        console.log "[DEBUG] : Ignore certificate errors: #{@ignoreCertificateErrors}" if @debug

        # Throw errors if required params are not passed
        if not @account then throw new Error 'Did not specified `account` for syno'
        if not @passwd then throw new Error 'Did not specified `passwd` for syno'
        if not (new RegExp(apiVersionsAvailable.join('|')).test(@apiVersion))
        then throw new Error "Api version: #{@apiVersion} is not available.
        Available versions are: #{apiVersionsAvailable.join(', ')}"

        # Create request with jar
        @request = request.defaults rejectUnauthorized: not @ignoreCertificateErrors, json: true
        request.debug = true if @debug
        # Init session property
        @session = null

        # Add auth API
        @auth = new Auth this
        # Add DSM API
        @dsm = @diskStationManager = new DSM this
        # Add FileStation API
        @fs = @fileStation = new FileStation this
        # Add Download Station API
        @dl = @downloadStation = new DownloadStation this
        # Add Audio Station API
        @as = @audioStation = new AudioStation this
        # Add Video Station API
        @vs = @videoStation = new VideoStation this
        # Add Video Station DTV API
        @dtv = @videoStationDTV = new VideoStationDTV this
        # Add Surveillance Station API
        @ss = @surveillanceStation = new SurveillanceStation this

    loadDefinitions: ->
        return @definitions if @definitions
        majorVersion = "#{@apiVersion.charAt(0)}.x"
        file_path = path.join(__dirname, "../definitions/#{majorVersion}/_full.json")
        @definitions = JSON.parse(fs.readFileSync file_path, 'utf8')
        return @definitions

    createFunctionsFor: (object, apis) ->
        definitions = this.loadDefinitions()
        for api in apis
            apiKeys = filter(keys(definitions), (key) -> startsWith(key, api))
            for api in apiKeys
                if definitions[api].methods
                    lastApiVersionMethods = definitions[api].methods[last(keys(definitions[api].methods))]
                    if not some(lastApiVersionMethods, (m) -> typeof(m) is 'string')
                        lastApiVersionMethods =
                          flatten(values(mapValues(lastApiVersionMethods, (m) -> keys(m))))
                    for method in lastApiVersionMethods
                        method = first(keys(method)) if typeof(method) is 'object'
                        functionName = Utils.createFunctionName(api, method)
                        path = if 'path' of definitions[api] then definitions[api].path else 'entry.cgi'
                        version = if 'maxVersion' of definitions[api] then definitions[api].maxVersion else 1
                        object.__proto__[functionName] = new Function('params', 'done', '
                        this.requestAPI({
                            params: params,
                            done: done,
                            apiInfos: {
                              sessionName: ' + "'" + object.sessionName + "'" + ',
                              api: ' + "'" + api + "'" + ',
                              version:' + "'" + version + "'" + ',
                              path: ' + "'" + path + "'" + ',
                              method: ' + "'" + method + "'" + '
                            }
                          });')
