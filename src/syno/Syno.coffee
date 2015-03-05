# Require node modules
request = require 'request'
{defaults} = require 'lodash'

# Class Syno
class Syno

    # Default synology parameters
    defParams =
        # Default protocol is HTTP (`http`)
        protocol: 'http'
        # Default host is `localhost`
        host: 'localhost'
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
        defaults this, params, defParams

        # Throw errors if required params are not passed
        if not @account then throw new Error 'Did not specified `account` for syno'
        if not @passwd then throw new Error 'Did not specified `passwd` for syno'

        # Create request with jar
        @request = request.defaults jar: true, json: true
        # Init session property
        @session = null

        # Add auth API
        @auth = new Auth this
        # Add FileStation API
        @fs = @fileStation = new FileStation this
        # Add Download Station API
        @dl = @downloadStation = new DownloadStation this
        # Add Audio Station API
        @as = @audioStation = new AudioStation this
        # Add Surveillance Station API
        @ss = @surveillanceStation = new SurveillanceStation this
