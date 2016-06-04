class SurveillanceStation extends AuthenticatedAPI

    constructor: (@syno)->
        super(@syno)
        @syno.createFunctionsFor(this, ['SYNO.SurveillanceStation'])

    getMethods: (params, done)->
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered
            
    # Handle Surveillance Station specific errors
    error: (code, api)->
        # Task API specific errors
        if api is 'SYNO.SurveillanceStation.Camera' or 'SYNO.SurveillanceStation.PTZ'
            switch code
                when 400 then return 'Execution failed'
                when 401 then return 'Parameter invalid'
                when 402 then return 'Camera disabled'
        # Event API specific errors
        if api is 'SYNO.SurveillanceStation.Event' or 'SYNO.SurveillanceStation.Emap'
            switch code
                when 400 then return 'Execution failed'
                when 401 then return 'Parameter invalid'
        # Device API specific errors
        if api is 'SYNO.SurveillanceStation.Device'
            switch code
                when 400 then return 'Execution failed'
                when 401 then return 'Service is not enabled'
        # Device API specific errors
        if api is 'SYNO.SurveillanceStation.Notification'
            switch code
                when 400 then return 'Execution failed'
        # Did not find any specifi error, so call super function
        return super