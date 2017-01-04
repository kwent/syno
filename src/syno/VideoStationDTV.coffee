class VideoStationDTV extends AuthenticatedAPI
  
    constructor: (@syno)->
        super(@syno)
        @syno.session = 'VideoStation'
        @syno.createFunctionsFor(this, ['SYNO.DTV'])

    getMethods: (params, done)->
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered