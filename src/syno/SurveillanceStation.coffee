class SurveillanceStation extends AuthenticatedAPI

    # SYNO.SurveillanceStation.Info (SurveillanceStation/info.cgi)
    
    getSurveillanceStationInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Info'
                version: 1
                path: 'SurveillanceStation/info.cgi'
                method: 'getinfo'
        }